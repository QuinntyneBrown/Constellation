import { test, expect } from '@playwright/test';
import { mockApiRoutes } from '../fixtures/api-mock';
import { AppShellPage } from '../pages/app-shell.page';

test.describe('Navigation', () => {
  let shell: AppShellPage;

  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
    shell = new AppShellPage(page);
    await shell.goto('/dashboard');
  });

  test('sidenav renders four nav items', async () => {
    await expect(shell.navItems).toHaveCount(4);
  });

  test('sidenav has correct nav labels', async () => {
    const labels = await shell.getNavItemLabels();
    expect(labels).toEqual(['Dashboard', 'Events', 'Sources', 'Settings']);
  });

  test('clicking Events navigates to /events', async ({ page }) => {
    await shell.clickNavItem('Events');
    await expect(page).toHaveURL(/\/events$/);
  });

  test('clicking Sources navigates to /sources', async ({ page }) => {
    await shell.clickNavItem('Sources');
    await expect(page).toHaveURL(/\/sources$/);
  });

  test('clicking Dashboard navigates to /dashboard', async ({ page }) => {
    await shell.clickNavItem('Events');
    await expect(page).toHaveURL(/\/events/);
    await shell.clickNavItem('Dashboard');
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('active nav item has highlighted styling', async () => {
    // On dashboard page, the Dashboard nav item should be active
    const dashboardItem = shell.navItems.filter({ hasText: 'Dashboard' });
    const bgColor = await dashboardItem.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    // #2C2C2C = rgb(44, 44, 44)
    expect(bgColor).toBe('rgb(44, 44, 44)');
  });

  test('toolbar brand text shows "Constellation"', async () => {
    await expect(shell.brandText).toHaveText('Constellation');
  });

  test('menu toggle hides the sidenav', async () => {
    await expect(shell.sidenavContainer).toBeVisible();
    await shell.toggleMenu();
    await expect(shell.sidenavContainer).not.toBeVisible();
  });

  test('menu toggle shows the sidenav again', async () => {
    await shell.toggleMenu();
    await expect(shell.sidenavContainer).not.toBeVisible();
    await shell.toggleMenu();
    await expect(shell.sidenavContainer).toBeVisible();
  });

  test('sidenav brand icon "stars" is present', async () => {
    const brandIcon = shell.getBrandIcon();
    await expect(brandIcon).toHaveText('stars');
  });

  test('nav items have correct Material icons', async () => {
    await expect(shell.getNavIcon('Dashboard')).toHaveText('dashboard');
    await expect(shell.getNavIcon('Events')).toHaveText('event');
    await expect(shell.getNavIcon('Sources')).toHaveText('cloud_sync');
    await expect(shell.getNavIcon('Settings')).toHaveText('settings');
  });
});
