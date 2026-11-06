import { test, expect } from "@playwright/test";

test("hovering 'digital experiences' decodes into 'agent interfaces' without moving the layout", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const swap = page.getByRole("button", { name: "digital experiences" });
  const headline = page.locator("p.hero-title");
  const size = async () =>
    (({ width, height }) => ({ width, height }))((await headline.boundingBox())!);
  const before = await size();

  await swap.hover();
  await expect(swap).toHaveAttribute("aria-pressed", "true");
  await page.waitForTimeout(120);
  await headline.screenshot({ path: "e2e/artifacts/hero-glitch.png" });
  await expect(swap.locator(".agent")).toHaveText("agent interfaces_");
  await headline.screenshot({ path: "e2e/artifacts/hero-agent.png" });
  expect(await size()).toEqual(before);

  await page.mouse.move(0, 0);
  await expect(swap).toHaveAttribute("aria-pressed", "false");
});
