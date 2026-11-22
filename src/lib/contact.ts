import { Ratelimit } from "@upstash/ratelimit";
import { z } from "zod";
import { getRedisClient } from "@lib/redis";

// One cap per visitor shared by the form, the chat and MCP, so no channel multiplies the spam budget.
const ratelimit = new Ratelimit({
  redis: getRedisClient(),
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: "contact",
});

export const Contact = z.object({
  message: z.string().trim().min(1).max(1000).describe("What the visitor wants to tell Candido"),
  email: z.email().max(254).describe("Visitor's email, so Candido can reply"),
});

export const sendContact = async (
  { message, email }: z.infer<typeof Contact>,
  ip: string,
  via: string,
): Promise<"sent" | "rate_limited" | "failed"> => {
  if (!(await ratelimit.limit(ip)).success) return "rate_limited";
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
        subject: `Site contact (${via}) from ${email}`,
        text: message,
      }),
    },
  );
  if (!res.ok) {
    console.error("contact: cloudflare send failed", res.status, await res.text());
    return "failed";
  }
  return "sent";
};
