<script lang="ts">
  import type { MenuItem } from '../env';
  import { links as contactLinks } from './Contact.svelte';
  import ChatBubble from './icons/ChatBubble.svelte';

  interface Props {
    tabs: MenuItem[];
    more: MenuItem[];
    chat: { href: string; label: string; placeholder: string };
    moreLabel: string;
  }

  let { tabs, more, chat, moreLabel }: Props = $props();

  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const trim = (href: string) => href.replace(/\/$/, '') || '/';
  const isActive = (href: string) => path === trim(href) || path.startsWith(trim(href) + '/');
  // Home (tabs[0]) is a prefix of every localized path, so it only matches exactly.
  const activeTab =
    tabs.slice(1).find((m) => isActive(m.href)) ?? (path === trim(tabs[0].href) ? tabs[0] : undefined);
  const moreActive = more.some((m) => !m.targetBlank && isActive(m.href));

  let minimized = $state(false);
  let dialog: HTMLDialogElement;

  // iOS 26 tab bar behavior: shrink while scrolling down, restore on scroll up.
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    if (Math.abs(y - lastY) < 8) return;
    minimized = y > lastY && y > 80;
    lastY = y;
  }
</script>

<svelte:window onscroll={onScroll} />

<div class="fade" aria-hidden="true"></div>
<div class="bar-wrap font-inclusive">
  <nav class="tabs glass" class:min={minimized} style:--n={tabs.length + 1} aria-label="navigation">
    {#each tabs as m}
      <a
        href={m.href}
        class:hidden-tab={minimized && m !== (activeTab ?? tabs[0])}
        inert={minimized && m !== (activeTab ?? tabs[0])}
        aria-current={m === activeTab ? 'page' : undefined}
        aria-label={m.label}
      >
        <m.icon />
        <span>{m.label}</span>
      </a>
    {/each}
    <button
      class:hidden-tab={minimized}
      inert={minimized}
      class:current={moreActive}
      aria-haspopup="dialog"
      onclick={() => dialog.showModal()}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-6" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>
      <span>{moreLabel}</span>
    </button>
  </nav>
  {#if minimized}
    <a href={chat.href} class="ask-pill glass">
      <ChatBubble aria-hidden="true" />
      {chat.placeholder}
    </a>
  {:else}
    <a href={chat.href} class="fab glass" aria-label={chat.label}>
      <ChatBubble aria-hidden="true" />
    </a>
  {/if}
</div>

<dialog
  bind:this={dialog}
  aria-label={moreLabel}
  class="sheet font-inclusive"
  onclick={(e) => e.target === dialog && dialog.close()}
>
  <div class="grabber" aria-hidden="true"></div>
  {#each more as m}
    <a
      href={m.href}
      target={m.targetBlank ? '_blank' : undefined}
      aria-current={!m.targetBlank && isActive(m.href) ? 'page' : undefined}
    >
      <span class="size-6"><m.icon /></span>
      {m.label}
      {#if m.targetBlank}<span aria-hidden="true">↗</span>{/if}
    </a>
  {/each}
  <div class="contact">
    {#each contactLinks as c}
      <a href={c.href} target="_blank" aria-label={c.label} title={c.label}>
        <c.icon />
      </a>
    {/each}
  </div>
</dialog>

<style>
  :global(body:has(.bar-wrap)) {
    padding-block-end: 7rem;
  }
  .fade {
    position: fixed;
    inset: auto 0 0 0;
    block-size: 7rem;
    pointer-events: none;
    z-index: 30;
    backdrop-filter: blur(8px);
    mask-image: linear-gradient(transparent, #000 70%);
    background: linear-gradient(transparent, rgb(255 255 255 / 0.6));
  }
  .bar-wrap {
    position: fixed;
    inset-inline: 0;
    inset-block-end: max(1rem, env(safe-area-inset-bottom));
    z-index: 40;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 0.5rem;
    padding-inline: 0.75rem;
    pointer-events: none;
  }
  .bar-wrap > * {
    pointer-events: auto;
  }
  .tabs {
    display: flex;
    padding: 4px;
    border-radius: 999px;
  }
  .tabs a,
  .tabs button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    /* Share the screen left after wrap padding, gap, Ask button and bar padding; cap at 68px. */
    inline-size: min(4.25rem, (100vw - 1.5rem - 0.5rem - 3.875rem - 8px) / var(--n));
    block-size: 3.375rem;
    border-radius: 999px;
    font-size: 11px;
    color: var(--color-slate-600);
    overflow: hidden;
    transition:
      inline-size 0.4s cubic-bezier(0.23, 1, 0.32, 1),
      opacity 0.25s,
      background-color 0.2s,
      scale 0.15s;
  }
  .tabs [aria-current='page'],
  .tabs .current {
    background: rgb(15 23 42 / 0.06);
    color: var(--color-blue-700);
  }
  .tabs a:active,
  .tabs button:active,
  .fab:active,
  .ask-pill:active {
    scale: 0.94;
  }
  @media (hover: hover) {
    .tabs a:not([aria-current='page']):hover,
    .tabs button:not(.current):hover {
      background: rgb(15 23 42 / 0.04);
    }
  }
  .tabs a:focus-visible,
  .tabs button:focus-visible,
  .fab:focus-visible,
  .ask-pill:focus-visible {
    outline: 2px solid var(--color-blue-700);
    outline-offset: 2px;
  }
  .tabs .hidden-tab {
    inline-size: 0;
    opacity: 0;
  }
  .tabs.min a:not(.hidden-tab) {
    inline-size: 3.375rem;
  }
  .tabs.min span {
    display: none;
  }
  .fab {
    inline-size: 3.875rem;
    block-size: 3.875rem;
    flex: none;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: var(--color-slate-600);
    transition: scale 0.15s;
  }
  .ask-pill {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    block-size: 3.875rem;
    padding-inline: 1.25rem;
    border-radius: 999px;
    color: var(--color-slate-500);
    font-size: 15px;
    flex: 0 1 16rem;
    white-space: nowrap;
    overflow: hidden;
    transition: scale 0.15s;
  }
  .sheet {
    inset: auto 0.5rem max(0.5rem, env(safe-area-inset-bottom));
    inline-size: auto;
    max-inline-size: 26rem;
    margin-inline: auto;
    padding: 0.5rem;
    border: 0;
    border-radius: 2rem;
    background: #fff;
    box-shadow: 0 8px 32px rgb(23 37 84 / 0.18);
    translate: 0 calc(100% + 1rem);
    transition:
      translate 0.45s cubic-bezier(0.23, 1, 0.32, 1),
      display 0.45s allow-discrete,
      overlay 0.45s allow-discrete;
  }
  .sheet[open] {
    translate: 0 0;
  }
  @starting-style {
    .sheet[open] {
      translate: 0 calc(100% + 1rem);
    }
  }
  .sheet::backdrop {
    background: rgb(15 23 42 / 0);
    transition:
      background-color 0.3s,
      display 0.3s allow-discrete,
      overlay 0.3s allow-discrete;
  }
  .sheet[open]::backdrop {
    background: rgb(15 23 42 / 0.25);
  }
  @starting-style {
    .sheet[open]::backdrop {
      background: rgb(15 23 42 / 0);
    }
  }
  .sheet a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border-radius: 1.5rem;
    font-size: 17px;
    color: var(--color-slate-700);
  }
  .sheet a:hover,
  .sheet a[aria-current='page'] {
    background: rgb(15 23 42 / 0.05);
  }
  .grabber {
    inline-size: 2.25rem;
    block-size: 5px;
    border-radius: 3px;
    background: var(--color-slate-300);
    margin: 2px auto 6px;
  }
  .contact {
    margin-block-start: 0.5rem;
    padding-block-start: 0.5rem;
    border-block-start: 1px solid var(--color-slate-200);
    display: flex;
    justify-content: center;
    gap: 0.5rem;
  }
  .contact a {
    display: grid;
    place-items: center;
    inline-size: 2.75rem;
    block-size: 2.75rem;
    padding: 0;
    border-radius: 50%;
    color: var(--color-slate-600);
  }
  .contact :global(svg) {
    inline-size: 1.25rem;
    block-size: 1.25rem;
  }
  @media (prefers-reduced-motion: reduce) {
    .tabs a,
    .tabs button,
    .sheet,
    .sheet::backdrop {
      transition-duration: 0s;
    }
  }
</style>
