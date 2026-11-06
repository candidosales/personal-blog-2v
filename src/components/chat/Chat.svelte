<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';
	import { DefaultChatTransport } from 'ai';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import Square from '@lucide/svelte/icons/square';
	import * as MessageScroller from '@components/ui/message-scroller';
	import * as Message from '@components/ui/message';
	import * as Bubble from '@components/ui/bubble';
	import * as InputGroup from '@components/ui/input-group';

	type Props = {
		initialQuestion?: string;
		labels: { placeholder: string; send: string; stop: string; error: string };
	};
	let { initialQuestion, labels }: Props = $props();

	const chat = new Chat({ transport: new DefaultChatTransport({ api: '/api/chat' }) });
	const busy = $derived(chat.status === 'submitted' || chat.status === 'streaming');
	let input = $state('');

	// Question typed on the home page arrives as ?q=; this island mounts once, so it sends once.
	if (initialQuestion) chat.sendMessage({ text: initialQuestion });

	const URL_RE = /(https?:\/\/[^\s)]+[^\s).,;:!?])/g;

	const send = (e: SubmitEvent) => {
		e.preventDefault();
		if (!input.trim() || busy) return;
		chat.sendMessage({ text: input });
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
												{#each p.text.split(URL_RE) as part, j (j)}
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
				{#if chat.error}
					<p role="alert" class="text-destructive">{labels.error}</p>
				{/if}
			</MessageScroller.Content>
		</MessageScroller.Viewport>
		<MessageScroller.Button />
	</MessageScroller.Root>
</MessageScroller.Provider>

<form onsubmit={send} class="mx-auto w-full max-w-2xl px-4 pbe-6">
	<InputGroup.Root class="rounded-3xl bg-white/80 backdrop-blur px-2 shadow-sm has-[[data-slot=input-group-control]:focus-visible]:ring-0">
		<InputGroup.Textarea
			bind:value={input}
			placeholder={labels.placeholder}
			aria-label={labels.placeholder}
			maxlength={500}
			rows={1}
			autofocus
			class="min-h-0 max-h-40 px-3 py-3 text-base md:text-base"
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
					class="rounded-full"
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
					class="rounded-full"
					aria-label={labels.send}
				>
					<ArrowUp />
				</InputGroup.Button>
			{/if}
		</InputGroup.Addon>
	</InputGroup.Root>
</form>
