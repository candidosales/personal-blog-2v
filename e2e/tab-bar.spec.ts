import { expect, test } from "@playwright/test";

test("tab bar marks the current page, opens More, and shrinks on scroll", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/blog", { waitUntil: "networkidle" });
  // Astro's dev-only toolbar sits over the bar at phone width.
  await page.addStyleTag({ content: "astro-dev-toolbar { display: none }" });
  const nav = page.getByRole("navigation", { name: "navigation" });
  await expect(nav.getByRole("link", { name: "Blog" })).toHaveAttribute("aria-current", "page");
  await expect(nav.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");

  // The bar and the Ask button fit an iPhone-width screen.
  const right = async (name: string) => {
    const box = (await page.getByRole("link", { name, exact: true }).boundingBox())!;
    return box.x + box.width;
  };
  expect(await right("Ask")).toBeLessThanOrEqual(390);
  expect((await nav.boundingBox())!.x).toBeGreaterThan(0);

  await nav.getByRole("button", { name: "More" }).click();
  const sheet = page.getByRole("dialog", { name: "More" });
  await expect(sheet.getByRole("link", { name: "Presentations" })).toBeVisible();
  await page.screenshot({ path: "e2e/artifacts/tab-bar-more.png" });
  await page.mouse.click(195, 100);
  await expect(sheet).toBeHidden();

  // Scrolling down keeps only the active tab; hidden tabs leave the keyboard order.
  await page.mouse.wheel(0, 600);
  await expect(page.getByRole("link", { name: "Ask about Candido..." })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Home" })).toHaveAttribute("inert", "");
  await expect(nav.getByRole("link", { name: "Blog" })).not.toHaveAttribute("inert");
  await page.screenshot({ path: "e2e/artifacts/tab-bar-min.png" });

  await page.mouse.wheel(0, -300);
  await expect(nav.getByRole("link", { name: "Home" })).not.toHaveAttribute("inert");
  await expect(page.getByRole("link", { name: "Ask", exact: true })).toBeVisible();
});
