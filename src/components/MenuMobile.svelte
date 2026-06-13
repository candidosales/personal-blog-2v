<script lang="ts">
  import { onDestroy } from 'svelte';
  import { tick } from 'svelte';
  import type { MenuItem } from '../env';
  import Search from './icons/Search.svelte';
  import { getLangFromUrl, useTranslations } from '@i18n/utils';

  interface SearchResult {
    id: string;
    type:
      | 'post'
      | 'external-post'
      | 'portfolio'
      | 'presentation'
      | 'volunteer'
      | 'extra'
      | 'page';
    title: string;
    description: string;
    href: string;
    publishDate?: string;
  }

  interface Props {
    menuItems?: MenuItem[];
  }

  let { menuItems = [] }: Props = $props();

  const lang = getLangFromUrl(new URL(window.location.href));
  const t = useTranslations(lang);

  let isSearchOpen = $state(false);
  let query = $state('');
  let isLoading = $state(false);
  let results = $state<SearchResult[]>([]);
  let selectedIndex = $state(0);
  let searchInputRef = $state<HTMLInputElement | null>(null);

  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  let abortController: AbortController | null = null;

  const preferredTabPaths = ['/blog', '/presentations', '/about'];
  const tabs = (() => {
    const internalItems = menuItems.filter((item) => !item.targetBlank);
    const home = internalItems.find((item) => item.href.endsWith('/') && !item.href.endsWith('/pt-br/'))
      ?? internalItems.find((item) => item.href === '/pt-br/' || item.href === '/')
      ?? internalItems[0];

    const picked = [home, ...preferredTabPaths
      .map((path) => internalItems.find((item) => item.href.endsWith(path)))
      .filter(Boolean)] as MenuItem[];

    const deduped = picked.filter(
      (item, index) => picked.findIndex((entry) => entry.href === item.href) === index,
    );

    if (deduped.length >= 4) return deduped.slice(0, 4);

    for (const item of internalItems) {
      if (deduped.find((entry) => entry.href === item.href)) continue;
      deduped.push(item);
      if (deduped.length === 4) break;
    }

    return deduped.slice(0, 4);
  })();

  const activePath = window.location.pathname;
  const localePrefix = lang === 'pt-br' ? '/pt-br' : '';
  const searchPath = `${localePrefix}/search`;

  const trackEvent = (eventName: string, payload: Record<string, unknown> = {}) => {
    const dataLayer = (window as unknown as { dataLayer?: Record<string, unknown>[] }).dataLayer;
    if (!dataLayer) return;
    dataLayer.push({ event: eventName, lang, ...payload });
  };

  const isActive = (href: string) => {
    if (href === '/' || href === '/pt-br/') {
      return activePath === href || activePath === href.replace(/\/$/, '');
    }
    return activePath.startsWith(href);
  };

  const openSearch = async () => {
    trackEvent('mobile_search_open');
    isSearchOpen = true;
    await tick();
    searchInputRef?.focus();
  };

  const closeSearch = () => {
    trackEvent('mobile_search_close', { queryLength: query.length });
    isSearchOpen = false;
    query = '';
    results = [];
    selectedIndex = 0;
    isLoading = false;
    abortController?.abort();
  };

  const searchNow = async (text: string) => {
    abortController?.abort();
    abortController = new AbortController();

    if (!text.trim()) {
      results = [];
      isLoading = false;
      selectedIndex = 0;
      return;
    }

    isLoading = true;

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}`,
        { signal: abortController.signal },
      );

      if (!response.ok) {
        results = [];
        return;
      }

      const payload = (await response.json()) as { results?: SearchResult[] };
      results = payload.results ?? [];
      selectedIndex = 0;
      trackEvent('mobile_search_query', {
        query: text,
        resultCount: results.length,
      });
    } catch {
      results = [];
    } finally {
      isLoading = false;
    }
  };

  const onQueryChange = (value: string) => {
    query = value;

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      searchNow(value);
    }, 250);
  };

  const navigateToResult = (href: string) => {
    trackEvent('mobile_search_result_click', { href, query });

    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    window.location.href = href;
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(lang === 'pt-br' ? 'pt-BR' : 'en-CA');
  };

  const onKeydown = (event: KeyboardEvent) => {
    if (!isSearchOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeSearch();
      return;
    }

    if (!results.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const selected = results[selectedIndex];
      if (selected) navigateToResult(selected.href);
    }
  };

  onDestroy(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    abortController?.abort();
  });
</script>

<svelte:window onkeydown={onKeydown} />

<div class="mobile-nav-shell fixed inset-x-0 bottom-3 z-50 md:hidden animate-fade-in-portfolio">
  <nav
    class="mx-auto w-[min(96%,460px)] rounded-full border border-blue-200 bg-blue-100/85 px-2 py-2 shadow-xl backdrop-blur-md"
    aria-label="Mobile navigation"
  >
    <ul class="grid grid-cols-5 gap-1">
      {#each tabs as item}
        <li>
          <a
            href={item.href}
            class={`flex h-12 flex-col items-center justify-center rounded-full text-xs font-inclusive transition-colors ${
              isActive(item.href)
                ? 'bg-blue-700 text-white'
                : 'text-blue-800 hover:bg-blue-200/80'
            }`}
            aria-current={isActive(item.href) ? 'page' : undefined}
            onclick={() => trackEvent('mobile_nav_click', { href: item.href, label: item.label })}
          >
            <span class="h-5 w-5">
              <item.icon />
            </span>
            <span class="mt-0.5 line-clamp-1">{item.label}</span>
          </a>
        </li>
      {/each}
      <li>
        <button
          type="button"
          class={`flex h-12 w-full flex-col items-center justify-center rounded-full text-xs font-inclusive transition-colors ${
            isSearchOpen
              ? 'bg-blue-700 text-white'
              : 'text-blue-800 hover:bg-blue-200/80'
          }`}
          aria-label={t('menu.search')}
          onclick={openSearch}
        >
          <span class="h-5 w-5">
            <Search />
          </span>
          <span class="mt-0.5 line-clamp-1">{t('menu.search')}</span>
        </button>
      </li>
    </ul>
  </nav>
</div>

{#if isSearchOpen}
  <div class="fixed inset-0 z-60 bg-white/95 p-4 backdrop-blur-sm md:hidden">
    <div class="mx-auto flex h-full w-full max-w-xl flex-col">
      <div class="mb-3 flex items-center gap-2">
        <input
          bind:this={searchInputRef}
          type="text"
          class="h-12 w-full rounded-2xl border border-blue-200 bg-white px-4 text-blue-900 outline-none focus:border-blue-500"
          placeholder={t('search.placeholder')}
          value={query}
          oninput={(event) => onQueryChange((event.target as HTMLInputElement).value)}
        />
        <button
          type="button"
          class="h-12 rounded-2xl bg-blue-700 px-4 font-inclusive text-white"
          onclick={closeSearch}
        >
          {t('search.close')}
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-auto rounded-2xl border border-blue-200 bg-white">
        {#if !query.trim()}
          <p class="p-4 text-sm text-blue-800/80">{t('search.hint')}</p>
        {:else if isLoading}
          <p class="p-4 text-sm text-blue-800/80">{t('search.loading')}</p>
        {:else if !results.length}
          <p class="p-4 text-sm text-blue-800/80">{t('search.empty')}</p>
        {:else}
          <ul class="p-2">
            {#each results as result, index}
              <li>
                <button
                  type="button"
                  class={`mb-1 w-full rounded-xl px-3 py-3 text-left transition-colors ${
                    selectedIndex === index
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-900 hover:bg-blue-100'
                  }`}
                  onclick={() => navigateToResult(result.href)}
                  onmouseenter={() => (selectedIndex = index)}
                >
                  <p class="line-clamp-1 font-medium">{result.title}</p>
                  {#if result.description}
                    <p
                      class={`mt-1 line-clamp-2 text-sm ${
                        selectedIndex === index ? 'text-white/80' : 'text-blue-800/80'
                      }`}
                    >
                      {result.description}
                    </p>
                  {/if}
                  <div
                    class={`mt-1 flex items-center justify-between text-xs ${
                      selectedIndex === index ? 'text-white/75' : 'text-blue-700/75'
                    }`}
                  >
                    <span>{result.type}</span>
                    <span>{formatDate(result.publishDate)}</span>
                  </div>
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>

      <a href={searchPath} class="mt-3 text-center text-sm font-medium text-blue-700 underline">
        {t('menu.search')}
      </a>
    </div>
  </div>
{/if}

<style>
  @media (max-width: 767px) {
    :global(body) {
      padding-bottom: calc(96px + env(safe-area-inset-bottom));
    }

    .mobile-nav-shell {
      padding-bottom: env(safe-area-inset-bottom);
    }
  }
</style>
