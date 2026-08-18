<script lang="ts">
  // Character-by-character "typer" reveal (inspired by arlan.me/vault/typer).
  // Each glyph ripples through pill / highlight / outline states before
  // settling into plain text. Runs frame-quantized so states hold for a beat.
  interface Segment {
    text: string;
    class?: string;
  }

  let {
    segments = [],
    fps = 23,
    duration = 1900,
    charWindow = 0.4,
    startDelay = 150,
  }: {
    segments?: Segment[];
    fps?: number;
    duration?: number; // ms for the full sweep
    charWindow?: number; // portion of the sweep a single char takes
    startDelay?: number; // ms before the sweep begins
  } = $props();

  type Ch = { char: string; seg: number; isSpace: boolean };
  const chars: Ch[] = [];
  segments.forEach((s, si) => {
    for (const c of s.text) chars.push({ char: c, seg: si, isSpace: c === ' ' });
  });
  const n = chars.length;

  // Deterministic per-char randomness so SSR and client agree.
  function mulberry32(seed: number) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // 1 = solid pill, 2 = highlight, 3 = outline pill.
  const PILL = [1, 2, 3];
  const seqs: number[][] = [];
  const starts: number[] = [];
  const easeInOut = (x: number) =>
    x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

  chars.forEach((_, i) => {
    const rnd = mulberry32(i * 2654435761 + 1);
    const len = 3 + Math.floor(rnd() * 3); // 3..5 beats before text
    const seq: number[] = [];
    for (let k = 0; k < len; k++) seq.push(PILL[Math.floor(rnd() * PILL.length)]);
    seqs.push(seq);
    const frac = n > 1 ? i / (n - 1) : 0;
    starts.push(easeInOut(frac) * (1 - charWindow));
  });

  // Start fully rendered so no-JS / SSR shows the text; the sweep re-hides
  // then reveals once the effect runs on the client.
  let states = $state<number[]>(new Array(n).fill(4));

  const isPill = (s: number) => s === 1 || s === 2 || s === 3;

  function computeStates(progress: number) {
    // Quantize so a char holds each state for a beat instead of flickering.
    const q = Math.round(progress * 10) / 10;
    const next = new Array(n);
    for (let i = 0; i < n; i++) {
      if (chars[i].isSpace) {
        next[i] = 4;
        continue;
      }
      const local = (q - starts[i]) / charWindow;
      if (local <= 0) next[i] = 0;
      else if (local >= 1) next[i] = 4;
      else {
        const seq = seqs[i];
        next[i] = seq[Math.min(seq.length - 1, Math.floor(local * seq.length))];
      }
    }
    states = next;
  }

  $effect(() => {
    const reduce = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduce) {
      states = new Array(n).fill(4);
      return;
    }

    let raf = 0;
    let startT = 0;
    let last = 0;
    const frameMs = 1000 / fps;

    const tick = (t: number) => {
      if (!startT) startT = t + startDelay;
      if (t - last >= frameMs) {
        last = t;
        const progress = Math.min(1, Math.max(0, (t - startT) / duration));
        computeStates(progress);
        if (progress >= 1) {
          states = new Array(n).fill(4);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  });
</script>

<span class="typer" aria-label={segments.map((s) => s.text).join('')}>
  {#each chars as c, i}
    {@const s = states[i]}
    {@const left = i > 0 && isPill(s) && states[i - 1] === s}
    {@const right = i < n - 1 && isPill(s) && states[i + 1] === s}
    <span
      aria-hidden="true"
      class="ch s{s} {segments[c.seg].class ?? ''}"
      style={`${left ? 'border-top-left-radius:0;border-bottom-left-radius:0;' : ''}${right ? 'border-top-right-radius:0;border-bottom-right-radius:0;' : ''}`}
      >{c.char}</span
    >
  {/each}
</span>

<style>
  .typer {
    /* keep normal wrapping; spaces stay real break opportunities */
    white-space: normal;
  }
  .ch {
    border-radius: 0.22em;
    /* discrete state changes, no tween — hold each beat */
    transition: none;
    /* paint the bar snug behind the glyph */
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
  /* 0: hidden but occupies width so nothing reflows */
  .ch.s0 {
    color: transparent;
    background: transparent;
  }
  /* 1: solid pill */
  .ch.s1 {
    color: transparent;
    background: currentColor;
  }
  /* 2: highlight (glyph visible on a soft bar) */
  .ch.s2 {
    color: inherit;
    background: color-mix(in srgb, currentColor 20%, transparent);
  }
  /* 3: outlined pill */
  .ch.s3 {
    color: transparent;
    background: transparent;
    box-shadow: inset 0 0 0 0.06em currentColor;
  }
  /* 4: settled text */
  .ch.s4 {
    color: inherit;
    background: transparent;
  }
</style>
