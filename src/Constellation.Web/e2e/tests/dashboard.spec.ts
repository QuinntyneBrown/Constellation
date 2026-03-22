import { test, expect } from '@playwright/test';
import { mockApiRoutes } from '../fixtures/api-mock';
import { DashboardPage } from '../pages/dashboard.page';
import { AppShellPage } from '../pages/app-shell.page';

test.describe('Dashboard', () => {
  let dashboard: DashboardPage;
  let shell: AppShellPage;

  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
    dashboard = new DashboardPage(page);
    shell = new AppShellPage(page);
    await dashboard.goto();
  });

  test('renders the page title "Dashboard"', async () => {
    await expect(dashboard.pageTitle).toHaveText('Dashboard');
  });

  test('renders four stat cards', async () => {
    await expect(dashboard.statCards).toHaveCount(4);
  });

  test('stat cards have correct icons', async () => {
    await expect(dashboard.getStatCardIcon(0)).toHaveText('event');
    await expect(dashboard.getStatCardIcon(1)).toHaveText('cloud_sync');
    await expect(dashboard.getStatCardIcon(2)).toHaveText('date_range');
    await expect(dashboard.getStatCardIcon(3)).toHaveText('analytics');
  });

  test('stat cards display populated values from API', async () => {
    // Sources Active should show 3
    await expect(dashboard.getStatCardValue(1)).toHaveText('3');
  });

  test('stat cards display correct labels', async () => {
    await expect(dashboard.getStatCardByLabel('Total Events')).toBeVisible();
    await expect(dashboard.getStatCardByLabel('Sources Active')).toBeVisible();
    await expect(dashboard.getStatCardByLabel('Events This Week')).toBeVisible();
    await expect(dashboard.getStatCardByLabel('Avg Relevance')).toBeVisible();
  });

  test('renders the "Recent Events" section title', async () => {
    await expect(dashboard.sectionTitle).toHaveText('Recent Events');
  });

  test('renders a data table with column headers', async () => {
    await expect(dashboard.dataTable).toBeVisible();
    const headers = await dashboard.tableHeaderCells.allTextContents();
    expect(headers.map((h) => h.trim().toUpperCase())).toEqual(
      expect.arrayContaining(['TITLE', 'DATE', 'SOURCE', 'RELEVANCE']),
    );
  });

  test('table has data rows from API', async () => {
    await expect(dashboard.tableRows).toHaveCount(5);
  });

  test('"View All Events" button navigates to /events', async ({ page }) => {
    await dashboard.viewAllButton.click();
    await expect(page).toHaveURL(/\/events$/);
  });

  test('"Refresh" button is present', async () => {
    await expect(dashboard.refreshButton).toBeVisible();
    await expect(dashboard.refreshButton).toContainText('Refresh');
  });

  test('page title uses Roboto font', async () => {
    const fontFamily = await dashboard.pageTitle.evaluate(
      (el) => getComputedStyle(el).fontFamily,
    );
    expect(fontFamily).toContain('Roboto');
  });

  test('content area has dark background #121212', async () => {
    const bg = await shell.mainContent.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    // #121212 = rgb(18, 18, 18)
    expect(bg).toBe('rgb(18, 18, 18)');
  });
});
