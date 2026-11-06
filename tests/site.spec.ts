import { test, expect } from "@playwright/test";

test("editorial homepage loads with brand, collections and no horizontal overflow", async ({ page }) => {
  const errors:string[]=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.goto("/");
  await expect(page).toHaveTitle(/Srikaram Creations/i);
  await expect(page.getByRole("heading",{name:/Some feelings deserve to be wrapped/i})).toBeVisible();
  for(const id of ["collections","occasions","story","corporate"]) await expect(page.locator("#"+id)).toHaveCount(1);
  const sizes=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.width+1);
  expect(errors).toEqual([]);
});

test("collection filters and search update the catalogue",async({page})=>{
 await page.goto("/");
 await expect(page.locator(".collection-card")).toHaveCount(4);
 await page.getByRole("button",{name:"Hampers",exact:true}).click();
 await expect(page.locator(".collection-card")).toHaveCount(1);
 await expect(page.locator(".collection-card")).toContainText("Festive hampers");
 await page.getByRole("button",{name:"All",exact:true}).click();
 await page.getByRole("textbox",{name:"Search collections"}).fill("corporate");
 await expect(page.locator(".collection-card")).toHaveCount(1);
 await expect(page.locator(".collection-card")).toContainText("Corporate gifting");
});

test("collection details open and enquiry can be started from a collection",async({page})=>{
 await page.goto("/");
 await page.getByRole("button",{name:"View Personalised keepsakes"}).click();
 await expect(page.getByRole("dialog",{name:/Personalised keepsakes/i})).toBeVisible();
 await page.getByRole("button",{name:/ENQUIRE ABOUT THIS COLLECTION/i}).click();
 const dialog=page.getByRole("dialog",{name:/Tell us what/i});
 await expect(dialog).toBeVisible();
 await expect(dialog.getByLabel("What are you looking for?")).toHaveValue("Personalised keepsakes");
 await dialog.getByRole("button",{name:"Close enquiry form"}).click();
});

test("enquiry form captures mixed-pricing brief and validates required details",async({page})=>{
 await page.goto("/");
 await page.locator(".nav-cta").click();
 const dialog=page.locator(".enquiry-modal");
 await expect(dialog).toBeVisible();
 await dialog.getByLabel("Your name").fill("QA Test");
 await dialog.getByLabel("Email address").fill("qa@example.com");
 await dialog.getByLabel("Budget").selectOption("₹1,000 – ₹2,500");
 await dialog.getByLabel("Quantity").fill("12");
 await dialog.getByLabel("Tell us a little more").fill("A small celebration gift");
 await expect(dialog.getByRole("button",{name:/PREPARE MY ENQUIRY/i})).toBeEnabled();
 await expect(dialog.getByLabel("Budget")).toHaveValue("₹1,000 – ₹2,500");
 await dialog.getByRole("button",{name:"Close enquiry form"}).click();
});

test("mobile navigation opens, closes and links to occasions",async({page,isMobile})=>{
 test.skip(!isMobile,"mobile-only");
 await page.goto("/");
 await page.getByRole("button",{name:"Toggle navigation"}).click();
 await expect(page.locator(".main-nav")).toHaveClass(/nav-open/);
 await page.locator(".main-nav").getByRole("link",{name:"Shop by occasion"}).click();
 await expect(page).toHaveURL(/#occasions$/);
 await expect(page.locator(".main-nav")).not.toHaveClass(/nav-open/);
});

test("mobile layout fits viewport and enquiry is usable",async({page,isMobile})=>{
 test.skip(!isMobile,"mobile-only");
 await page.goto("/");
 const sizes=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
 expect(sizes.scroll).toBeLessThanOrEqual(sizes.width+1);
 await page.locator(".nav-cta").click();
 await expect(page.locator(".enquiry-modal")).toBeVisible();
 await expect(page.getByLabel("Budget")).toBeVisible();
});

test("failed hosted product photos use a branded fallback rather than broken image UI",async({page})=>{
 await page.goto("/");
 await page.locator(".hero-visual img").evaluate((img:HTMLImageElement)=>{img.dispatchEvent(new Event("error"));});
 await expect(page.locator(".hero-visual")).toHaveClass(/image-fallback/);
 await expect(page.locator(".hero-visual img")).toHaveCSS("display","none");
});

test("FAQ accordion exposes expanded state",async({page})=>{
 await page.goto("/");
 const first=page.getByRole("button",{name:/Can I customise a gift/i});
 await expect(first).toHaveAttribute("aria-expanded","true");
 await first.click();
 await expect(first).toHaveAttribute("aria-expanded","false");
});
