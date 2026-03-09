import { test, expect } from '@playwright/test';

test.describe('Routing', () => {
    test('Arabic index page should link to Arabic detail pages', async ({ page }) => {
        await page.goto('./ar/');

        // Find the first autopsy card and click it
        const autopsyCard = page.locator('section:has-text("تشريح الادعاءات") .card').first();

        if (await autopsyCard.count() > 0) {
            const href = await autopsyCard.getAttribute('href');
            expect(href).toContain('/ar/autopsies/');

            await autopsyCard.click();
            await expect(page).toHaveURL(new RegExp('/ar/autopsies/'));
        }
    });

    test('Arabic index page should link to the Constitution in Arabic', async ({ page }) => {
        await page.goto('./ar/');
        const constitutionLink = page.getByRole('link', { name: '← اقرأ الدستور' });
        await expect(constitutionLink).toBeVisible();
        await expect(constitutionLink).toHaveAttribute('href', /.*ar\/constitution/);
    });
});
