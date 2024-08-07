import { Redis } from "@upstash/redis";
import type { APIRoute } from "astro";

import md5 from 'crypto-js/md5';
import requestIp from 'request-ip';
import type { Vote } from "src/env";

 
const HASHSET_KEY = "votes";
const url = import.meta.env.UPSTASH_REDIS_REST_URL;
const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
 
const redis = new Redis({ url, token });


export const GET: APIRoute = async function GET() {
	try {
		const votes: Record<string, Vote> | null = await redis.hgetall(HASHSET_KEY);

		return new Response(JSON.stringify({ votes }), {
			headers: { "content-type": "application/json" },
			status: 200,
		  });
	} catch (error: unknown) {
		console.error(`Error in /api GET method: ${error as string}`);
		return new Response(JSON.stringify({ votes: [] }), {
		  headers: { "content-type": "application/json" },
		  status: 200,
		});
	  }
}


export const POST: APIRoute = async function POST({ request }) {

	const ip = requestIp.getClientIp(request);	
	const fingerprint = md5(ip ?? '').toString();

	const data: { room: string, value: string } = await request.json();
	const key = `${data.room}:${fingerprint}`;

	await redis.hset(HASHSET_KEY, {
		[key]: data.value,
	});

	return new Response(JSON.stringify({ vote: {
		[key]: data.value
	} }), {
		headers: { "content-type": "application/json" },
		status: 200,
	});

}