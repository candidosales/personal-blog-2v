import type { APIRoute } from "astro";
import { Contact, sendContact } from "@lib/contact";

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const parsed = Contact.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return new Response("Bad request", { status: 400 });
  const result = await sendContact(parsed.data, clientAddress, "form");
  if (result === "rate_limited") return new Response("Too many requests", { status: 429 });
  if (result === "failed") return new Response("Send failed", { status: 502 });
  return new Response(null, { status: 204 });
};
