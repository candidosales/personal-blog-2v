import type { APIRoute } from "astro";
import { Ratelimit } from "@upstash/ratelimit";
import { z } from "zod";
import { getRedisClient } from "@lib/redis";

// A public form gets spam; cap each visitor.
const ratelimit = new Ratelimit({
  redis: getRedisClient(),
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: "contact",
});

const Body = z.object({
  message: z.string().trim().min(1).max(1000),
  email: z.email().max(254),
});

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const { success } = await ratelimit.limit(clientAddress);
  if (!success) return new Response("Too many requests", { status: 429 });

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return new Response("Bad request", { status: 400 });
  const { message, email } = parsed.data;

  // Cloudflare Email Service: the sender domain must be onboarded under Email Sending.
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${import.meta.env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.CLOUDFLARE_EMAIL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: { address: "contact@candidosales.me", name: "Site contact" },
        to: "candidosg@gmail.com",
        reply_to: email,
        subject: `Site contact from ${email}`,
        text: message,
      }),
    },
  );
  if (!res.ok) {
    console.error("contact: cloudflare send failed", res.status, await res.text());
    return new Response("Send failed", { status: 502 });
  }
  return new Response(null, { status: 204 });
};
