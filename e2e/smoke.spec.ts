import { test, expect } from "@playwright/test";

/**
 * Smoke fără dependență de DB: pagina 404 brandată și skip-link-ul global.
 * Fluxurile cu conținut (servicii/blog/formulare) necesită Supabase pornit;
 * extinde aici după ce seed-ul DB e disponibil în CI.
 */

test("404 brandat pe rută inexistentă", async ({ page }) => {
  const res = await page.goto("/aceasta-pagina-nu-exista-xyz");
  expect(res?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: /Pagina nu a putut fi găsită/i }),
  ).toBeVisible();
  // Link util către pagina principală.
  await expect(page.getByRole("link", { name: /Acasă/i }).first()).toBeVisible();
});

test("skip-to-content devine vizibil la focus", async ({ page }) => {
  await page.goto("/aceasta-pagina-nu-exista-xyz");
  const skip = page.getByRole("link", { name: /Sari la conținut/i });
  await skip.focus();
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute("href", "#main");
});
