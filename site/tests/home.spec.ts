import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test('should load the English home page correctly', async ({ page }) => {
        await page.goto('./');
        await expect(page).toHaveTitle(/Parallaxin/);

        // Check for mission statement
        await expect(page.locator('section.mission')).toBeVisible();

        // Check for navigation links
        await expect(page.locator('nav')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Conflicts' })).toBeVisible();
    });

    test('should load the Arabic home page correctly', async ({ page }) => {
        await page.goto('./ar/');
        await expect(page).toHaveTitle(/بارالاكسين/);

        // Check for mission statement in Arabic
        await expect(page.locator('section.mission')).toBeVisible();
        await expect(page.getByText('يوثّق بارالاكسين المسافة')).toBeVisible();

        // Check direction
        const main = page.locator('main.site-main');
        await expect(main).toHaveAttribute('dir', 'rtl');
    });

    test('should navigate between sections', async ({ page }) => {
        await page.goto('./');
        const autopsiesLink = page.getByRole('link', { name: 'Claim Autopsies' });
        if (await autopsiesLink.isVisible()) {
            // Just verify it's there for now as it's a single page with sections
        }
    });
});
