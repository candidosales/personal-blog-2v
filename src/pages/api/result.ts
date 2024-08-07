/* TRUNCATED */

import { Redis } from "@upstash/redis";
import type { APIRoute } from "astro";
 
const HASHSET_KEY = "votes";
const url = import.meta.env.UPSTASH_REDIS_REST_URL;
const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
 
const redis = new Redis({ url, token });


export const GET: APIRoute = async function GET({ url }) {

	let count = { ok: 0, uncertain: 0, stop: 0, total: 0 };

	if(url.searchParams.get('delete')) {
		await redis.del(HASHSET_KEY);
	}

	
	try {
		const votes: Record<string, string> | null = await redis.hgetall(HASHSET_KEY);

		if (votes) {
			count = countVotes(votes);
			return new Response(JSON.stringify({ ...count }), {
				headers: { "content-type": "application/json" },
				status: 200,
			  });
		} else {
			return new Response(JSON.stringify({ ...count }), {
				headers: { "content-type": "application/json" },
				status: 200,
			  });
		}
		
	} catch (error: unknown) {
		console.error(`Error in /api GET method: ${error as string}`);
		return new Response(JSON.stringify({ ...count }), {
		  headers: { "content-type": "application/json" },
		  status: 200,
		});
	  }
}


function countVotes(votes: Record<string, string>) {
    let counts = { ok: 0, uncertain: 0, stop: 0, total: 0 };

    for (let key in votes) {
        if (votes.hasOwnProperty(key)) {
            if (votes[key] === 'ok') {
                counts.ok++;
            } else if (votes[key] === 'uncertain') {
                counts.uncertain++;
            } else if (votes[key] === 'stop') {
                counts.stop++;
            }
			counts.total++;
        }
    }

    return counts;
}


export const DELETE: APIRoute = async function DELETE() {
	await redis.hdel(HASHSET_KEY);

	return new Response(JSON.stringify('deleted'), {
		headers: { "content-type": "application/json" },
		status: 200,
	  });
}