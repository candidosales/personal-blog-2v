<script lang="ts">
  let { human, agent }: { human: string; agent: string } = $props();

  // ASCII only: monospace keeps every glyph the same width, so decoding never shifts layout.
  const GLYPHS = '!<>-_\\/[]{}=+*^?#01$%&';
  let on = $state(false);
  let glitching = $state(false);
  let text = $state(agent);
  let raf = 0;
  let timer = 0;

  const decode = () => {
    cancelAnimationFrame(raf);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 450, 1);
      const settled = Math.floor(p * agent.length);
      text = [...agent]
        .map((c, i) => (i < settled || c === ' ' ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
        .join('');
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };

  const set = (next: boolean) => {
    if (next === on) return;
    on = next;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    glitching = true;
    clearTimeout(timer);
    timer = setTimeout(() => (glitching = false), 280);
    if (on) decode();
  };
</script>

<button
  type="button"
  aria-pressed={on}
  class="swap"
  class:on
  class:glitching
  onpointerenter={(e) => e.pointerType === 'mouse' && set(true)}
  onpointerleave={(e) => e.pointerType === 'mouse' && set(false)}
  onclick={(e) => (e as PointerEvent).pointerType !== 'mouse' && set(!on)}
>
  <span class="human font-newsreader italic tracking-normal">{human}</span>
  <span class="agent font-mono" aria-hidden="true">{text}<span class="cursor">_</span></span>
</button>

<style>
  .swap {
    display: inline-grid;
    font: inherit;
    color: inherit;
    letter-spacing: inherit;
    text-align: start;
    cursor: crosshair;
  }
  .swap > span {
    grid-area: 1 / 1;
    align-self: baseline;
    transition:
      opacity 150ms var(--ease-out),
      filter 150ms var(--ease-out);
  }
  .agent {
    opacity: 0;
    font-size: 0.88em;
    letter-spacing: -0.04em;
    color: #1d4ed8;
  }
  .on .human {
    opacity: 0;
    filter: blur(4px);
  }
  .on .agent {
    opacity: 1;
  }
  .cursor {
    color: #22d3ee;
  }
  .swap:focus-visible {
    outline: 2px solid #1d4ed8;
    outline-offset: 4px;
    border-radius: 8px;
  }

  @media (prefers-reduced-motion: no-preference) {
    .on .cursor {
      animation: blink 1s steps(1) infinite;
    }
    .glitching {
      animation: glitch 280ms steps(1) both;
    }
    .glitching > span {
      text-shadow:
        -3px 0 #d946ef,
        3px 0 #22d3ee;
    }
  }

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }

  @keyframes glitch {
    0% {
      clip-path: inset(12% 0 58% 0);
      translate: -5px 0;
    }
    20% {
      clip-path: inset(62% 0 4% 0);
      translate: 5px 0;
    }
    40% {
      clip-path: inset(30% 0 34% 0);
      translate: -3px 0;
      skew: -8deg 0;
    }
    60% {
      clip-path: inset(0 0 74% 0);
      translate: 4px 0;
    }
    80% {
      clip-path: inset(46% 0 18% 0);
      translate: -2px 0;
    }
    100% {
      clip-path: inset(0);
      translate: 0;
    }
  }
</style>
