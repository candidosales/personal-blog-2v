import { getRedisClient } from '@lib/redis';
import type { APIRoute } from 'astro';
import type { Vote } from 'src/env';

const HASHSET_KEY = 'votes';

export const GET: APIRoute = async function GET() {
  try {
    const redis = getRedisClient();
    const votes: Record<string, Vote> | null = await redis.hgetall(HASHSET_KEY);

    return new Response(JSON.stringify({ votes }), {
      headers: { 'content-type': 'application/json' },
      status: 200,
    });
  } catch (error: unknown) {
    console.error(`Error in /api GET method: ${error as string}`);
    return new Response(JSON.stringify({ error: (error as Error).message, votes: [] }), {
      headers: { 'content-type': 'application/json' },
      status: 500,
    });
  }
};

export const POST: APIRoute = async function POST({ request, clientAddress }) {
  try {
    const data: { room: string; value: string; fingerprint: string } =
      await request.json();

    const key = `${data.room}:${data.fingerprint}-${clientAddress}`;
    const redis = getRedisClient();

    await redis.hset(HASHSET_KEY, {
      [key]: data.value,
    });

    return new Response(
      JSON.stringify({
        vote: {
          [key]: data.value,
        },
      }),
      {
        headers: { 'content-type': 'application/json' },
        status: 200,
      },
    );
  } catch (error: unknown) {
    console.error(`Error in /api POST method: ${error as string}`);
    return new Response(JSON.stringify({ error: (error as Error).message, vote: null }), {
      headers: { 'content-type': 'application/json' },
      status: 500,
    });
  }
};
