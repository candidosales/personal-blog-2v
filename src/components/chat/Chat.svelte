<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';
	import { DefaultChatTransport } from 'ai';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import Square from '@lucide/svelte/icons/square';
	import * as MessageScroller from '@components/ui/message-scroller';
	import * as Message from '@components/ui/message';
	import * as Bubble from '@components/ui/bubble';
	import * as InputGroup from '@components/ui/input-group';
	import { MODE_FRAMES, paintFrame, resolvePreset } from 'thinking-orbs/engine';

	type Props = {
		initialQuestion?: string;
		starters: string[];
		labels: { placeholder: string; send: string; stop: string; error: string; thinking: string; contact: string };
	};
	let { initialQuestion, starters, labels }: Props = $props();

	const chat = new Chat({ transport: new DefaultChatTransport({ api: '/api/chat' }) });
	const busy = $derived(chat.status === 'submitted' || chat.status === 'streaming');
	let input = $state('');
	// Shimmer until the first answer token lands.
	const thinking = $derived.by(() => {
		const last = chat.messages.at(-1);
		return busy && !(last?.role === 'assistant' && last.parts.some((p) => p.type === 'text' && p.text));
	});

	// Question typed on the home page arrives as ?q=; this island mounts once, so it sends once.
	if (initialQuestion) chat.sendMessage({ text: initialQuestion });

	// Svelte port of the thinking-orbs React wrapper: the "Agent planning" orb (weaving, 20px) in the site blue.
	const orb = (canvas: HTMLCanvasElement) => {
		const size = 20;
		const dpr = Math.min(2, devicePixelRatio || 1);
		canvas.width = canvas.height = size * dpr;
		const ctx = canvas.getContext('2d')!;
		const { mode, speed, opts } = resolvePreset('weaving', size);
		const draw = (t: number) => {
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, size, size);
			paintFrame(ctx, MODE_FRAMES[mode](size, t, opts), false, { r: 30, g: 64, b: 175 });
		};
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return draw(0.6);
		let raf = 0;
		const loop = () => {
			draw((performance.now() / 1000) * speed);
			raf = requestAnimationFrame(loop);
		};
		loop();
		return () => cancelAnimationFrame(raf);
	};

	// The model ends each answer with ">> Q1 | Q2 | Q3"; cut at the first ">" line so it never flashes while streaming.
	const splitAnswer = (text: string): [string, string[]] => {
		const i = text.search(/(^|\n)>/);
		if (i < 0) return [text, []];
		const qs = text.slice(i).replace(/^\n?>+/, '').split('|');
		return [text.slice(0, i).trimEnd(), qs.map((q) => q.trim()).filter(Boolean).slice(0, 3)];
	};
	const followUps = $derived.by(() => {
		const last = chat.messages.at(-1);
		if (busy || last?.role !== 'assistant') return [];
		return splitAnswer(last.parts.map((p) => (p.type === 'text' ? p.text : '')).join(''))[1];
	});
	const ask = (text: string) => !busy && chat.sendMessage({ text });

	const URL_RE = /(https?:\/\/[^\s)]+[^\s).,;:!?])/g;

	const send = (e: SubmitEvent) => {
		e.preventDefault();
		if (!input.trim() || busy) return;
		ask(input);
		input = '';
	};
</script>

<MessageScroller.Provider>
	<MessageScroller.Root class="flex-1">
		<MessageScroller.Viewport>
			<MessageScroller.Content class="mx-auto max-w-2xl px-4 pbs-20 pbe-8" aria-live="polite">
				{#each chat.messages as m (m.id)}
					<MessageScroller.Item messageId={m.id} scrollAnchor={m.role === 'user'}>
						<Message.Root align={m.role === 'user' ? 'end' : 'start'} data-role={m.role}>
							<Message.Content>
								<Bubble.Root variant={m.role === 'user' ? 'default' : 'ghost'}>
									<Bubble.Content
										class={['text-base whitespace-pre-wrap', m.role === 'user' && 'rounded-3xl px-4']}
									>
										{#each m.parts as p, i (i)}
											{#if p.type === 'text'}
												{#each (m.role === 'assistant' ? splitAnswer(p.text)[0] : p.text).split(URL_RE) as part, j (j)}
													{#if j % 2}
														<a href={part} target="_blank" rel="noreferrer" class="underline break-all">{part}</a>
													{:else}{part}{/if}
												{/each}
											{/if}
										{/each}
									</Bubble.Content>
								</Bubble.Root>
							</Message.Content>
						</Message.Root>
					</MessageScroller.Item>
				{/each}
				{#if thinking}
					<div role="status" class="flex items-center gap-2 py-2">
						<canvas {@attach orb} aria-hidden="true" class="size-5"></canvas>
						<span class="shimmer text-base font-medium">{labels.thinking}</span>
					</div>
				{/if}
				{#if followUps.length}
					<div class="border-bs border-slate-200 pbs-2">{@render suggestions(followUps)}</div>
				{/if}
				{#if !busy && chat.messages.filter((m) => m.role === 'assistant').length >= 2}
					<a
						href="https://www.linkedin.com/in/candidosales/"
						target="_blank"
						rel="noreferrer"
						class="inline-flex w-fit items-center rounded-full border border-border bg-white/70 px-4 py-2 text-sm text-foreground hover:bg-muted active:scale-97 focus-visible:outline-2 focus-visible:outline-ring"
					>
						{labels.contact}
					</a>
				{/if}
				{#if chat.error}
					<p role="alert" class="text-destructive">{labels.error}</p>
				{/if}
			</MessageScroller.Content>
		</MessageScroller.Viewport>
		<MessageScroller.Button />
	</MessageScroller.Root>
</MessageScroller.Provider>

{#snippet suggestions(qs: string[])}
	<ul>
		{#each qs as q (q)}
			<li>
				<button
					type="button"
					onclick={() => ask(q)}
					class="flex w-full gap-2 rounded-xl px-1 py-2 text-start text-slate-600 hover:bg-slate-900/4 hover:text-slate-900 active:scale-99 focus-visible:outline-2 focus-visible:outline-blue-700"
				>
					<span aria-hidden="true" class="text-slate-400">↳</span>{q}
				</button>
			</li>
		{/each}
	</ul>
{/snippet}

{#if chat.messages.length === 0}
	<div class="mx-auto w-full max-w-2xl px-4 pbe-2">{@render suggestions(starters)}</div>
{/if}

<form onsubmit={send} class="mx-auto w-full max-w-2xl px-3 pbe-[max(1rem,env(safe-area-inset-bottom))]">
	<InputGroup.Root class="glass min-h-15.5 rounded-[31px] ps-3 pe-2.5 has-[[data-slot=input-group-control]:focus-visible]:border-slate-900/10 has-[[data-slot=input-group-control]:focus-visible]:ring-0">
		<InputGroup.Textarea
			bind:value={input}
			placeholder={labels.placeholder}
			aria-label={labels.placeholder}
			maxlength={500}
			rows={1}
			autofocus
			class="min-h-0 max-h-40 px-2 py-4 text-base md:text-base text-slate-900 placeholder:text-slate-500"
			onkeydown={(e: KeyboardEvent) => {
				if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
					e.preventDefault();
					(e.currentTarget as HTMLTextAreaElement).form?.requestSubmit();
				}
			}}
		/>
		<InputGroup.Addon align="inline-end">
			{#if busy}
				<InputGroup.Button
					size="icon-sm"
					variant="secondary"
					class="size-10 rounded-full bg-slate-900/6 text-slate-700 hover:bg-slate-900/10"
					aria-label={labels.stop}
					onclick={() => chat.stop()}
				>
					<Square class="fill-current" />
				</InputGroup.Button>
			{:else}
				<InputGroup.Button
					type="submit"
					size="icon-sm"
					variant="default"
					aria-disabled={!input.trim()}
					class={['size-10 rounded-full', !input.trim() && 'bg-slate-900/6 text-slate-500 hover:bg-slate-900/6']}
					aria-label={labels.send}
				>
					<ArrowUp />
				</InputGroup.Button>
			{/if}
		</InputGroup.Addon>
	</InputGroup.Root>
</form>

<style>
	.shimmer {
		width: fit-content;
		color: transparent;
		background: linear-gradient(110deg, rgb(30 64 175 / 0.4) 30%, #1e40af 50%, rgb(30 64 175 / 0.4) 70%) 0 0 / 200% 100%;
		background-clip: text;
		animation: shimmer 1.8s linear infinite;
	}
	@keyframes shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.shimmer {
			animation: none;
		}
	}
</style>
