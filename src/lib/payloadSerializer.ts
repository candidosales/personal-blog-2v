export type ContentBlock =
    | { type: 'html', html: string }
    | { type: 'code', code: string, language: string, title?: string };

export function lexicalToBlocks(node: any, apiUrl: string = 'http://localhost:3000'): ContentBlock[] {
    if (!node) return [];

    const blocks: ContentBlock[] = [];
    let currentHtml = '';

    const flushHtml = () => {
        if (currentHtml.trim()) {
            blocks.push({ type: 'html', html: currentHtml });
            currentHtml = '';
        }
    };

    const processNode = (n: any) => {
        if (!n) return;

        if (Array.isArray(n)) {
            n.forEach(child => processNode(child));
            return;
        }

        if (n.root) {
            processNode(n.root.children);
            return;
        }

        switch (n.type) {
            case 'root':
                processNode(n.children);
                break;
            case 'paragraph':
                currentHtml += `<p class="mb-6 leading-7">${lexicalToHtmlInternal(n.children, apiUrl)}</p>`;
                break;
            case 'heading':
                const tag = n.tag || 'h2';
                let headingClass = "font-medium text-blue-800 tracking-tight";
                if (tag === 'h1') headingClass += " text-4xl mb-6";
                else if (tag === 'h2') headingClass += " text-3xl mb-4 mt-10";
                else if (tag === 'h3') headingClass += " text-2xl mb-3 mt-8";
                currentHtml += `<${tag} class="${headingClass}">${lexicalToHtmlInternal(n.children, apiUrl)}</${tag}>`;
                break;
            case 'list':
                const listTag = n.tag === 'ol' ? 'ol' : 'ul';
                const listClass = n.tag === 'ol' ? 'list-decimal ml-6 mb-6 space-y-2' : 'list-disc ml-6 mb-6 space-y-2';
                currentHtml += `<${listTag} class="${listClass}">${lexicalToHtmlInternal(n.children, apiUrl)}</${listTag}>`;
                break;
            case 'block':
                if (n.fields?.blockType === 'code' && n.fields.code?.trim()) {
                    flushHtml();
                    blocks.push({
                        type: 'code',
                        code: n.fields.code,
                        language: n.fields.language || 'text',
                        title: n.fields.blockName || undefined
                    });
                } else if (n.fields?.blockType === 'mediaBlock') {
                    const media = n.fields.media;
                    currentHtml += `
            <figure class="my-10">
              <img src="${apiUrl}${media.url}" alt="${media.alt || ''}" class="rounded-xl w-full shadow-md" />
              ${media.caption ? `<figcaption class="text-center text-sm text-blue-800/60 mt-4 italic">${media.caption}</figcaption>` : ''}
            </figure>
          `;
                }
                break;
            default:
                // Handle other top-level nodes or recursion
                if (n.children) {
                    currentHtml += lexicalToHtmlInternal(n, apiUrl);
                }
        }
    };

    processNode(node);
    flushHtml();

    return blocks;
}

// Internal helper for inline elements
function lexicalToHtmlInternal(node: any, apiUrl: string): string {
    if (!node) return '';

    if (Array.isArray(node)) {
        return node.map(child => lexicalToHtmlInternal(child, apiUrl)).join('');
    }

    switch (node.type) {
        case 'text':
            let textContent = node.text || '';
            if (node.format === 1) textContent = `<strong class="font-semibold text-blue-900">${textContent}</strong>`;
            if (node.format === 2) textContent = `<em class="italic">${textContent}</em>`;
            if (node.format === 8) textContent = `<code class="bg-blue-50 text-blue-800 px-1 py-0.5 rounded text-sm">${textContent}</code>`;
            return textContent;
        case 'listitem':
            return `<li class="text-blue-900/90">${lexicalToHtmlInternal(node.children, apiUrl)}</li>`;
        case 'link':
            const url = node.fields?.url || '#';
            const target = node.fields?.newTab ? '_blank' : '_self';
            return `<a href="${url}" class="text-blue-600 hover:text-blue-800 underline transition-colors" target="${target}">${lexicalToHtmlInternal(node.children, apiUrl)}</a>`;
        default:
            if (node.children) {
                return lexicalToHtmlInternal(node.children, apiUrl);
            }
            return '';
    }
}
