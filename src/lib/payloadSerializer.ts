export function lexicalToHtml(node: any, apiUrl: string = 'http://localhost:3000'): string {
    if (!node) return '';

    if (Array.isArray(node)) {
        return node.map(child => lexicalToHtml(child, apiUrl)).join('');
    }

    if (node.root) {
        return lexicalToHtml(node.root.children, apiUrl);
    }

    switch (node.type) {
        case 'root':
            return lexicalToHtml(node.children, apiUrl);
        case 'paragraph':
            return `<p class="mb-6 leading-7">${lexicalToHtml(node.children, apiUrl)}</p>`;
        case 'heading':
            const tag = node.tag || 'h2';
            let headingClass = "font-medium text-blue-800 tracking-tight";
            if (tag === 'h1') headingClass += " text-4xl mb-6";
            else if (tag === 'h2') headingClass += " text-3xl mb-4 mt-10";
            else if (tag === 'h3') headingClass += " text-2xl mb-3 mt-8";
            return `<${tag} class="${headingClass}">${lexicalToHtml(node.children, apiUrl)}</${tag}>`;
        case 'text':
            let textContent = node.text || '';
            if (node.format === 1) textContent = `<strong class="font-semibold text-blue-900">${textContent}</strong>`;
            if (node.format === 2) textContent = `<em class="italic">${textContent}</em>`;
            if (node.format === 8) textContent = `<code class="bg-blue-50 text-blue-800 px-1 py-0.5 rounded text-sm">${textContent}</code>`;
            return textContent;
        case 'list':
            const listTag = node.tag === 'ol' ? 'ol' : 'ul';
            const listClass = node.tag === 'ol' ? 'list-decimal ml-6 mb-6 space-y-2' : 'list-disc ml-6 mb-6 space-y-2';
            return `<${listTag} class="${listClass}">${lexicalToHtml(node.children, apiUrl)}</${listTag}>`;
        case 'listitem':
            return `<li class="text-blue-900/90">${lexicalToHtml(node.children, apiUrl)}</li>`;
        case 'block':
            if (node.fields?.blockType === 'code') {
                const blockName = node.fields.blockName;
                const code = node.fields.code;
                const language = node.fields.language || 'text';
                return `
          <div class="my-8 rounded-lg overflow-hidden border border-blue-100 shadow-sm">
            ${blockName ? `<div class="bg-blue-50 px-4 py-2 border-b border-blue-100 text-xs font-mono text-blue-600">${blockName}</div>` : ''}
            <pre class="p-4 bg-slate-900 text-slate-100 overflow-x-auto"><code class="text-sm leading-6">${code}</code></pre>
          </div>
        `;
            }
            if (node.fields?.blockType === 'mediaBlock') {
                const media = node.fields.media;
                return `
          <figure class="my-10">
            <img src="${apiUrl}${media.url}" alt="${media.alt || ''}" class="rounded-xl w-full shadow-md" />
            ${media.caption ? `<figcaption class="text-center text-sm text-blue-800/60 mt-4 italic">${media.caption}</figcaption>` : ''}
          </figure>
        `;
            }
            return '';
        case 'link':
            const url = node.fields?.url || '#';
            const target = node.fields?.newTab ? '_blank' : '_self';
            return `<a href="${url}" class="text-blue-600 hover:text-blue-800 underline transition-colors" target="${target}">${lexicalToHtml(node.children, apiUrl)}</a>`;
        default:
            if (node.children) {
                return lexicalToHtml(node.children, apiUrl);
            }
            return '';
    }
}
