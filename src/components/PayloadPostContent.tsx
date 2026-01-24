import React from 'react';

interface LexicalNode {
    type: string;
    children?: LexicalNode[];
    text?: string;
    format?: number;
    tag?: string;
    fields?: any;
}

interface PayloadPostContentProps {
    content: {
        root: {
            children: LexicalNode[];
        };
    };
    apiUrl?: string;
}

const LexicalRenderer: React.FC<{ node: LexicalNode; apiUrl: string }> = ({ node, apiUrl }) => {
    switch (node.type) {
        case 'root':
            return <>{node.children?.map((child, idx) => <LexicalRenderer key={idx} node={child} apiUrl={apiUrl} />)}</>;
        case 'paragraph':
            return <p className="mb-6 leading-7">{node.children?.map((child, idx) => <LexicalRenderer key={idx} node={child} apiUrl={apiUrl} />)}</p>;
        case 'heading':
            const Tag = (node.tag || 'h2') as any;
            let headingClass = "font-medium text-blue-800 tracking-tight";
            if (node.tag === 'h1') headingClass += " text-4xl mb-6";
            else if (node.tag === 'h2') headingClass += " text-3xl mb-4 mt-10";
            else if (node.tag === 'h3') headingClass += " text-2xl mb-3 mt-8";
            return <Tag className={headingClass}>{node.children?.map((child, idx) => <LexicalRenderer key={idx} node={child} apiUrl={apiUrl} />)}</Tag>;
        case 'text':
            let textContent = node.text || '';
            if (node.format === 1) return <strong className="font-semibold text-blue-900">{textContent}</strong>;
            if (node.format === 2) return <em className="italic">{textContent}</em>;
            if (node.format === 8) return <code className="bg-blue-50 text-blue-800 px-1 py-0.5 rounded text-sm">{textContent}</code>;
            return <>{textContent}</>;
        case 'list':
            const ListTag = node.tag === 'ol' ? 'ol' : 'ul';
            const listClass = node.tag === 'ol' ? 'list-decimal ml-6 mb-6 space-y-2' : 'list-disc ml-6 mb-6 space-y-2';
            return <ListTag className={listClass}>{node.children?.map((child, idx) => <LexicalRenderer key={idx} node={child} apiUrl={apiUrl} />)}</ListTag>;
        case 'listitem':
            return <li className="text-blue-900/90">{node.children?.map((child, idx) => <LexicalRenderer key={idx} node={child} apiUrl={apiUrl} />)}</li>;
        case 'block':
            if (node.fields?.blockType === 'code') {
                return (
                    <div className="my-8 rounded-lg overflow-hidden border border-blue-100 shadow-sm">
                        {node.fields.blockName && (
                            <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 text-xs font-mono text-blue-600">
                                {node.fields.blockName}
                            </div>
                        )}
                        <pre className="p-4 bg-slate-900 text-slate-100 overflow-x-auto">
                            <code className="text-sm leading-6">
                                {node.fields.code}
                            </code>
                        </pre>
                    </div>
                );
            }
            if (node.fields?.blockType === 'mediaBlock') {
                const media = node.fields.media;
                return (
                    <figure className="my-10">
                        <img
                            src={`${apiUrl}${media.url}`}
                            alt={media.alt || ''}
                            className="rounded-xl w-full shadow-md"
                        />
                        {media.caption && (
                            <figcaption className="text-center text-sm text-blue-800/60 mt-4 italic">
                                {media.caption}
                            </figcaption>
                        )}
                    </figure>
                );
            }
            return null;
        case 'link':
            return (
                <a
                    href={node.fields?.url || '#'}
                    className="text-blue-600 hover:text-blue-800 underline transition-colors"
                    target={node.fields?.newTab ? '_blank' : '_self'}
                >
                    {node.children?.map((child, idx) => <LexicalRenderer key={idx} node={child} apiUrl={apiUrl} />)}
                </a>
            );
        default:
            console.warn('Unknown node type:', node.type);
            return null;
    }
};

export const PayloadPostContent: React.FC<PayloadPostContentProps> = ({ content, apiUrl = 'http://localhost:3000' }) => {
    if (!content || !content.root) return null;

    return (
        <div className="prose prose-slate prose-lg max-w-none text-blue-900/90 selection:bg-blue-100">
            <LexicalRenderer node={content.root as any} apiUrl={apiUrl} />
        </div>
    );
};
