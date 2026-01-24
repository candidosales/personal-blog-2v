export const PAYLOAD_API_URL = import.meta.env.PAYLOAD_API_URL || 'http://localhost:3000';

export async function getPosts() {
    const response = await fetch(`${PAYLOAD_API_URL}/api/posts?depth=2&draft=false`);
    if (!response.ok) {
        throw new Error('Failed to fetch posts from Payload CMS');
    }
    const data = await response.json();
    return data.docs;
}

export async function getPostBySlug(slug: string) {
    const response = await fetch(`${PAYLOAD_API_URL}/api/posts?where[slug][equals]=${slug}&depth=2&draft=false`);
    if (!response.ok) {
        throw new Error('Failed to fetch post from Payload CMS');
    }
    const data = await response.json();
    return data.docs[0];
}
