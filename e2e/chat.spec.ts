import { mkdirSync, writeFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const transcript: { question: string; answer: string }[] = [];

const ask = async (page: import("@playwright/test").Page, question: string) => {
  const input = page.getByRole("textbox");
  const before = await page.locator('[data-role="assistant"]').count();
  await input.fill(question);
  await input.press("Enter");
  const thinking = page.getByRole("status").filter({ hasText: "Thinking…" });
  if (before === 0) {
    await expect(thinking).toBeVisible();
    await page.screenshot({ path: "e2e/artifacts/chat-thinking.png" });
  }
  await expect(page.locator('[data-role="assistant"]')).toHaveCount(before + 1, {
    timeout: 45_000,
  });
  // The orb hands over to the answer at the first token, not when the stream ends.
  await expect(page.locator('[data-role="assistant"]').last()).not.toBeEmpty({ timeout: 45_000 });
  await expect(thinking).toBeHidden({ timeout: 300 });
  // The stop button shows while streaming and swaps back to "Ask" when done.
  await expect(page.getByRole("button", { name: "Stop" })).toBeHidden({ timeout: 45_000 });
  const answer = (await page.locator('[data-role="assistant"]').last().innerText()).trim();
  transcript.push({ question, answer });
  return answer;
};

test("home MCP button copies the install command; /chat?q= streams an answer", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Copy MCP command" }).click();
  await expect(page.getByRole("button", { name: "Copied MCP command" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "claude mcp add --transport http candidosales https://www.candidosales.me/mcp",
  );

  await page.goto("/chat?q=Which%20projects%20have%20an%20MCP%20server%3F", {
    waitUntil: "networkidle",
  });
  await expect(page.locator('[data-role="assistant"]')).toHaveText(/Converte Extrato|Pia/, {
    timeout: 45_000,
  });
  await expect(page.getByRole("button", { name: "Stop" })).toBeHidden({ timeout: 45_000 });
  const answer = await page.locator('[data-role="assistant"]').last().innerText();
  transcript.push({ question: "Which projects have an MCP server?", answer });
  expect(answer).toMatch(/Converte Extrato/);
  expect(answer).toMatch(/(Turismo|Tourism) Pia/);
});

test("chat declines off-topic requests and answers in Portuguese", async ({ page }) => {
  await page.goto("/chat", { waitUntil: "networkidle" });
  await expect(page.getByRole("button", { name: "What has he built?" })).toBeVisible();
  const poem = await ask(page, "Write me a poem about the ocean.");
  expect(poem.split("\n").length).toBeLessThan(5);
  expect(poem).toMatch(/Candido/);

  const nice = await ask(page, "Candido is a nice person?");
  expect(nice).toMatch(/kind|friendly|nice/i);
  expect(nice).not.toMatch(/can't speak|cannot speak/i);

  const work = await ask(page, "Where has Candido worked? Does he need a visa for Canada?");
  expect(work).toMatch(/Smile\.io/);
  expect(work).toMatch(/Cisco/);
  expect(work).toMatch(/citizen/i);

  await expect(page.getByRole("link", { name: "Say hi to Candido →" })).toBeVisible();

  const hire = await ask(page, "Is he available for a contract and what are his rates?");
  expect(hire).toMatch(/linkedin\.com\/in\/candidosales/);

  // Each answer ends with model-written follow-ups; the ">>" line never shows in the answer.
  expect(hire).not.toMatch(/>>/);
  const followUps = page.getByRole("listitem").getByRole("button");
  await expect(followUps).toHaveCount(3);
  const followUp = (await followUps.first().innerText()).replace("↳", "").trim();
  await followUps.first().click();
  await expect(page.locator('[data-role="user"]').last()).toHaveText(followUp);
  await expect(page.getByRole("button", { name: "Stop" })).toBeHidden({ timeout: 45_000 });

  const pt = await ask(page, "Onde o Candido mora?");
  expect(pt).toMatch(/Canadá/);

  mkdirSync("e2e/artifacts", { recursive: true });
  writeFileSync("e2e/artifacts/chat-transcript.json", JSON.stringify(transcript, null, 2));
  await page.screenshot({ path: "e2e/artifacts/chat.png", fullPage: true });
});
