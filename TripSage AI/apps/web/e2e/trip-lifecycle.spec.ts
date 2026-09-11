import { test, expect } from "@playwright/test";

test.describe("Section 57: End-to-End Travel Intelligence Lifecycle", () => {
  const testEmail = `playwright_${Date.now()}@tripsage.ai`;
  const testPassword = "Password123!";
  const testName = "Playwright Voyager";

  test("full flow: signup → create trip → analyze → verify 5 agents & handoffs → view itinerary", async ({
    page,
  }) => {
    // -------------------------------------------------------------
    // 1. Sign Up (Section 44)
    // -------------------------------------------------------------
    await page.goto("/sign-up");
    await expect(page).toHaveTitle(/TripSage/);

    await page.fill('input[placeholder="Alex Walker"]', testName);
    await page.fill('input[placeholder="you@example.com"]', testEmail);
    await page.fill('input[placeholder="••••••••"]', testPassword);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/app\/dashboard/, { timeout: 15000 });
    await expect(page.locator("h1:has-text('Trip Planning Workspace')")).toBeVisible();

    // -------------------------------------------------------------
    // 2. Create Trip (Section 37)
    // -------------------------------------------------------------
    await page.click("text=Plan New Trip");
    await expect(page).toHaveURL(/\/app\/trips\/new/, { timeout: 10000 });

    // Destination & Origin
    await page.fill('input[placeholder*="Istanbul, Turkey or Tokyo"]', "Tokyo, Japan");
    await page.fill('input[placeholder*="Lahore, Pakistan or London"]', "San Francisco (SFO)");

    // Budget
    await page.fill('input[type="number"]', "4200");

    // Select Travel Style
    await page.click("button:has-text('Comfort')");

    // Toggle Interests
    await page.click("button:has-text('Photography')");

    // Submit form
    await page.click("button:has-text('Build My Trip')");

    // -------------------------------------------------------------
    // 3. Trip Workspace
    // -------------------------------------------------------------
    await expect(page).toHaveURL(/\/app\/trips\/[a-f0-9-]+$/, { timeout: 15000 });
    await expect(page.locator("h1:has-text('Tokyo, Japan')")).toBeVisible();
    await expect(page.locator("text=USD $4,200")).toBeVisible();

    // -------------------------------------------------------------
    // 4. Start Analysis & Navigate to Analysis Screen (Section 39)
    // -------------------------------------------------------------
    await page.click("button:has-text('Activate 5 Agents')");
    await expect(page).toHaveURL(/\/app\/trips\/[a-f0-9-]+\/analysis/, { timeout: 15000 });

    // Verify Section 39 Headline
    await expect(page.locator("h1:has-text('YOUR TRIP IS BEING BUILT.')")).toBeVisible();

    // -------------------------------------------------------------
    // 5. Verify 5 Specialist Agents (Section 35)
    // -------------------------------------------------------------
    await expect(page.locator("text=Destination Research").first()).toBeVisible();
    await expect(page.locator("text=Budget Intelligence").first()).toBeVisible();
    await expect(page.locator("text=Flight & Stay").first()).toBeVisible();
    await expect(page.locator("text=Local Experiences").first()).toBeVisible();
    await expect(page.locator("text=Trip Orchestrator").first()).toBeVisible();

    // -------------------------------------------------------------
    // 6. Verify Handoffs & Completion
    // -------------------------------------------------------------
    // Wait for the final itinerary / completion indicator
    await expect(page.locator("text=All 5 Agents Completed").first()).toBeVisible({ timeout: 35000 });
    await expect(page.locator("text=View Final Itinerary").first()).toBeVisible();

    // Verify Agent 1 Artifact
    await page.locator("button:has-text('Destination Research')").first().click();
    await expect(page.locator("text=Structured Specialist Artifact (DESTINATION_RESEARCH)")).toBeVisible();

    // Verify Agent 2 Budget Math Artifact (Deterministic Python math)
    await page.locator("button:has-text('Budget Intelligence')").first().click();
    await expect(page.locator("text=Structured Specialist Artifact (BUDGET_ANALYSIS)")).toBeVisible();

    // -------------------------------------------------------------
    // 7. View Final Itinerary
    // -------------------------------------------------------------
    await page.locator("text=View Final Itinerary").first().click();
    await expect(page).toHaveURL(/\/app\/trips\/[a-f0-9-]+$/);
    await expect(page.locator("h1:has-text('Tokyo, Japan')")).toBeVisible();
  });
});
