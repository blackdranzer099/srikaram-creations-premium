import { test, expect } from "@playwright/test";

test("home page loads with the expected brand and main sections", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", error => pageErrors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle(/Srikaram Creations/i);
  await expect(page.locator("#home")).toBeVisible();
  for (const id of ["intro", "story", "collections", "gallery", "experience"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(dimensions.document, "page should not overflow horizontally").toBeLessThanOrEqual(dimensions.viewport + 1);
  expect(pageErrors).toEqual([]);
});

test("gallery category filters and lightbox work", async ({ page }) => {
  await page.goto("/");
  await page.locator("#gallery").scrollIntoViewIfNeeded();
  await expect(page.locator(".gallery-card")).toHaveCount(8);
  await page.getByRole("button", { name: "Festive Hampers", exact: true }).click();
  await expect(page.locator(".gallery-card")).toHaveCount(2);
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator(".gallery-card")).toHaveCount(8);
  await page.locator(".gallery-card").first().click();
  await expect(page.locator(".lightbox")).toBeVisible();
  await page.getByRole("button", { name: "Close gallery image" }).click();
  await expect(page.locator(".lightbox")).toHaveCount(0);
});

test("experience carousel and FAQ accordion respond to interaction", async ({ page }) => {
  await page.goto("/");
  await page.locator("#experience").scrollIntoViewIfNeeded();
  await expect(page.locator(".experience-number")).toContainText("EXPERIENCE 01");
  await page.getByRole("button", { name: "Next experience" }).click();
  await expect(page.locator(".experience-number")).toContainText("EXPERIENCE 02");
  const firstFaq = page.getByRole("button", { name: /Can I personalise a gift/ });
  await firstFaq.click();
  await expect(firstFaq).toHaveAttribute("aria-expanded", "false");
  await firstFaq.click();
  await expect(firstFaq).toHaveAttribute("aria-expanded", "true");
});

test("enquiry dialog validates fields and copies a complete enquiry", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.locator(".header-cta").click();
  const dialog = page.locator(".enquiry-modal");
  await expect(dialog).toBeVisible();
  await dialog.getByLabel("Your name").fill("QA Test");
  await dialog.getByLabel("Email address").fill("qa@example.com");
  await dialog.getByLabel("Tell us a little more").fill("Automated browser test only");
  await dialog.getByRole("button", { name: /COPY ENQUIRY DETAILS/i }).click();
  await expect(dialog.getByRole("status")).toContainText("Enquiry details copied");
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("qa@example.com");
  await dialog.getByRole("button", { name: "Close enquiry form" }).click();
  await expect(dialog).toHaveCount(0);
});

test("mobile navigation opens and closes", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-only navigation test");
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Toggle menu" })).toBeVisible();
  await page.getByRole("button", { name: "Toggle menu" }).click();
  await expect(page.locator(".nav")).toHaveClass(/nav-open/);
  await page.locator(".nav").getByRole("link", { name: "Collections" }).click();
  await expect(page.locator(".nav")).not.toHaveClass(/nav-open/);
  await expect(page).toHaveURL(/#collections$/);
});

test("mobile layout has no horizontal overflow and enquiry is usable", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-only layout test");
  await page.goto("/");
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(dimensions.document, "mobile page should not overflow horizontally").toBeLessThanOrEqual(dimensions.viewport + 1);
  await page.locator(".header-cta").click();
  const dialog = page.locator(".enquiry-modal");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("Your name")).toBeVisible();
  await expect(dialog.getByLabel("Email address")).toBeVisible();
});

test("brand photography is served from local optimized assets", async ({ page }) => {
  const failedImages: string[] = [];
  page.on("requestfailed", request => {
    if (request.url().includes("/images/official-site-image-")) failedImages.push(request.url());
  });
  await page.goto("/");
  await page.locator("#collections").scrollIntoViewIfNeeded();
  const localImages = page.locator('img[src^="/images/official-site-image-"]');
  await expect(localImages.first()).toBeAttached();
  await expect.poll(async () => localImages.evaluateAll(images => images.filter(image => image.complete && image.naturalWidth > 0).length)).toBeGreaterThan(0);
  expect(failedImages, "local brand images should load without network failures").toEqual([]);
});
