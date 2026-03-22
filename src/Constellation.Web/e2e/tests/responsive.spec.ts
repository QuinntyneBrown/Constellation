import { test, expect } from '@playwright/test';
import { mockApiRoutes } from '../fixtures/api-mock';

// ─── Mobile Tests (402px) ──────────────────────────────────────────────────────

test.describe('Mobile Layout (402px)', () => {
  test.use({ viewport: { width: 402, height: 874 } });

  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
  });

  test.describe('Navigation', () => {
    test('bottom tab bar is visible with 4 tabs', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const tabBar = page.locator('.bottom-tab-bar');
      await expect(tabBar).toBeVisible();

      const tabItems = page.locator('.bottom-tab-bar .tab-item');
      await expect(tabItems).toHaveCount(4);
    });

    test('bottom tab bar shows correct labels', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const labels = page.locator('.bottom-tab-bar .tab-label');
      await expect(labels.nth(0)).toHaveText('Dashboard');
      await expect(labels.nth(1)).toHaveText('Events');
      await expect(labels.nth(2)).toHaveText('Sources');
      await expect(labels.nth(3)).toHaveText('Settings');
    });

    test('bottom tab bar shows correct icons', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const icons = page.locator('.bottom-tab-bar .tab-icon');
      await expect(icons.nth(0)).toHaveText('dashboard');
      await expect(icons.nth(1)).toHaveText('event');
      await expect(icons.nth(2)).toHaveText('cloud_sync');
      await expect(icons.nth(3)).toHaveText('settings');
    });

    test('sidenav is not visible on mobile', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const sidenav = page.locator('.sidenav-container');
      await expect(sidenav).not.toBeVisible();
    });

    test('icon rail is not visible on mobile', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const iconRail = page.locator('.icon-rail');
      await expect(iconRail).not.toBeVisible();
    });

    test('active tab is highlighted with primary color', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const activeTab = page.locator('.bottom-tab-bar .tab-item.active');
      await expect(activeTab).toHaveCount(1);

      const activeIcon = activeTab.locator('.tab-icon');
      const color = await activeIcon.evaluate((el) => getComputedStyle(el).color);
      // #BB86FC = rgb(187, 134, 252)
      expect(color).toBe('rgb(187, 134, 252)');
    });

    test('clicking Events tab navigates to /events', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const eventsTab = page.locator('.bottom-tab-bar .tab-item').nth(1);
      await eventsTab.click();
      await expect(page).toHaveURL(/\/events$/);
    });

    test('clicking Sources tab navigates to /sources', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const sourcesTab = page.locator('.bottom-tab-bar .tab-item').nth(2);
      await sourcesTab.click();
      await expect(page).toHaveURL(/\/sources$/);
    });
  });

  test.describe('Toolbar', () => {
    test('toolbar height is 56px on mobile', async ({ page }) => {
      await page.goto('/dashboard');
      const toolbar = page.locator('cst-toolbar .toolbar');
      await toolbar.waitFor({ state: 'visible', timeout: 15000 });

      const height = await toolbar.evaluate((el) => getComputedStyle(el).height);
      expect(height).toBe('56px');
    });

    test('search and notification icons are hidden on mobile', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const desktopIcons = page.locator('.desktop-toolbar-icon');
      const count = await desktopIcons.count();
      for (let i = 0; i < count; i++) {
        await expect(desktopIcons.nth(i)).not.toBeVisible();
      }
    });

    test('toolbar shows brand title and avatar', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      await expect(page.locator('.toolbar-title')).toBeVisible();
      await expect(page.locator('.toolbar-title')).toHaveText('Constellation');
      await expect(page.locator('.avatar-circle')).toBeVisible();
    });
  });

  test.describe('Dashboard', () => {
    test('stat cards stack vertically on mobile', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-stat-card').first().waitFor({ state: 'visible', timeout: 15000 });

      const statsRow = page.locator('.stats-row');
      const flexDirection = await statsRow.evaluate((el) => getComputedStyle(el).flexDirection);
      expect(flexDirection).toBe('column');
    });

    test('page padding is reduced on mobile', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-stat-card').first().waitFor({ state: 'visible', timeout: 15000 });

      const dashboard = page.locator('.dashboard');
      const padding = await dashboard.evaluate((el) => getComputedStyle(el).padding);
      expect(padding).toBe('16px');
    });
  });

  test.describe('Events List', () => {
    test('source dropdown is hidden on mobile', async ({ page }) => {
      await page.goto('/events');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-event-card').first().waitFor({ state: 'visible', timeout: 10000 });

      const selectField = page.locator('.select-field');
      await expect(selectField).not.toBeVisible();
    });

    test('date input is hidden on mobile', async ({ page }) => {
      await page.goto('/events');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-event-card').first().waitFor({ state: 'visible', timeout: 10000 });

      const dateField = page.locator('.date-field');
      await expect(dateField).not.toBeVisible();
    });

    test('search bar is still visible on mobile', async ({ page }) => {
      await page.goto('/events');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-event-card').first().waitFor({ state: 'visible', timeout: 10000 });

      const searchField = page.locator('.search-field');
      await expect(searchField).toBeVisible();
    });

    test('paginator hides items-per-page on mobile', async ({ page }) => {
      await page.goto('/events');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-event-card').first().waitFor({ state: 'visible', timeout: 10000 });

      const pagLabel = page.locator('.pag-label');
      await expect(pagLabel).not.toBeVisible();

      const pagSelect = page.locator('.pag-select');
      await expect(pagSelect).not.toBeVisible();
    });
  });

  test.describe('Event Detail', () => {
    test('metadata stacks vertically on mobile', async ({ page }) => {
      await page.goto('/events/1');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-event-detail-card').waitFor({ state: 'visible', timeout: 10000 });

      const metaGrid = page.locator('.meta-grid');
      const direction = await metaGrid.evaluate((el) => getComputedStyle(el).flexDirection);
      expect(direction).toBe('column');
    });

    test('action buttons are full-width on mobile', async ({ page }) => {
      await page.goto('/events/1');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-event-detail-card').waitFor({ state: 'visible', timeout: 10000 });

      const actionsRow = page.locator('.actions-row');
      const direction = await actionsRow.evaluate((el) => getComputedStyle(el).flexDirection);
      expect(direction).toBe('column-reverse');
    });

    test('detail card padding is reduced on mobile', async ({ page }) => {
      await page.goto('/events/1');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-event-detail-card').waitFor({ state: 'visible', timeout: 10000 });

      const card = page.locator('.detail-card');
      const padding = await card.evaluate((el) => getComputedStyle(el).padding);
      expect(padding).toBe('20px');
    });
  });

  test.describe('Sources', () => {
    test('source cards stack vertically on mobile', async ({ page }) => {
      await page.goto('/sources');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-source-card').first().waitFor({ state: 'visible', timeout: 10000 });

      const grid = page.locator('.sources-grid');
      const direction = await grid.evaluate((el) => getComputedStyle(el).flexDirection);
      expect(direction).toBe('column');
    });

    test('page header stacks on mobile', async ({ page }) => {
      await page.goto('/sources');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-source-card').first().waitFor({ state: 'visible', timeout: 10000 });

      const header = page.locator('app-sources-overview .page-header');
      const direction = await header.evaluate((el) => getComputedStyle(el).flexDirection);
      expect(direction).toBe('column');
    });
  });
});

// ─── Tablet Tests (768px) ──────────────────────────────────────────────────────

test.describe('Tablet Layout (768px)', () => {
  test.use({ viewport: { width: 768, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
  });

  test.describe('Navigation', () => {
    test('icon rail sidenav is visible', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const iconRail = page.locator('.icon-rail');
      await expect(iconRail).toBeVisible();
    });

    test('icon rail is 64px wide', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const iconRail = page.locator('.icon-rail');
      const width = await iconRail.evaluate((el) => el.getBoundingClientRect().width);
      expect(width).toBe(64);
    });

    test('icon rail shows icons without labels', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const railBtns = page.locator('.rail-btn');
      await expect(railBtns).toHaveCount(4);

      // Verify icons are present
      const icons = page.locator('.rail-btn .material-symbols-rounded');
      await expect(icons.nth(0)).toHaveText('dashboard');
      await expect(icons.nth(1)).toHaveText('event');
      await expect(icons.nth(2)).toHaveText('cloud_sync');
      await expect(icons.nth(3)).toHaveText('settings');
    });

    test('icon rail shows brand icon', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const brandIcon = page.locator('.icon-rail .brand-icon');
      await expect(brandIcon).toBeVisible();
      await expect(brandIcon).toHaveText('stars');
    });

    test('bottom tab bar is not visible on tablet', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const tabBar = page.locator('.bottom-tab-bar');
      await expect(tabBar).not.toBeVisible();
    });

    test('full sidenav is not visible on tablet', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const sidenav = page.locator('.sidenav-container');
      await expect(sidenav).not.toBeVisible();
    });

    test('active rail icon is highlighted', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const activeBtn = page.locator('.rail-btn.active');
      await expect(activeBtn).toHaveCount(1);

      const activeIcon = activeBtn.locator('.material-symbols-rounded');
      const color = await activeIcon.evaluate((el) => getComputedStyle(el).color);
      // #BB86FC = rgb(187, 134, 252)
      expect(color).toBe('rgb(187, 134, 252)');
    });

    test('clicking icon rail navigates to correct page', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      // Click Events icon (index 1)
      await page.locator('.rail-btn').nth(1).click();
      await expect(page).toHaveURL(/\/events$/);
    });
  });

  test.describe('Dashboard', () => {
    test('stat cards display in 2x2 grid', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-stat-card').first().waitFor({ state: 'visible', timeout: 15000 });

      const statsRow = page.locator('.stats-row');
      const flexWrap = await statsRow.evaluate((el) => getComputedStyle(el).flexWrap);
      expect(flexWrap).toBe('wrap');
    });

    test('page padding is 24px on tablet', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-stat-card').first().waitFor({ state: 'visible', timeout: 15000 });

      const dashboard = page.locator('.dashboard');
      const padding = await dashboard.evaluate((el) => getComputedStyle(el).padding);
      expect(padding).toBe('24px');
    });
  });

  test.describe('Events List', () => {
    test('search input is visible on tablet', async ({ page }) => {
      await page.goto('/events');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-event-card').first().waitFor({ state: 'visible', timeout: 10000 });

      await expect(page.locator('.search-field')).toBeVisible();
    });

    test('source dropdown is visible on tablet', async ({ page }) => {
      await page.goto('/events');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-event-card').first().waitFor({ state: 'visible', timeout: 10000 });

      await expect(page.locator('.select-field')).toBeVisible();
    });

    test('date input is hidden on tablet', async ({ page }) => {
      await page.goto('/events');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-event-card').first().waitFor({ state: 'visible', timeout: 10000 });

      await expect(page.locator('.date-field')).not.toBeVisible();
    });
  });

  test.describe('Event Detail', () => {
    test('metadata uses grid layout on tablet', async ({ page }) => {
      await page.goto('/events/1');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-event-detail-card').waitFor({ state: 'visible', timeout: 10000 });

      const metaGrid = page.locator('.meta-grid');
      const display = await metaGrid.evaluate((el) => getComputedStyle(el).display);
      expect(display).toBe('grid');
    });
  });

  test.describe('Sources', () => {
    test('source cards wrap in 2-column grid on tablet', async ({ page }) => {
      await page.goto('/sources');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-source-card').first().waitFor({ state: 'visible', timeout: 10000 });

      const grid = page.locator('.sources-grid');
      const flexWrap = await grid.evaluate((el) => getComputedStyle(el).flexWrap);
      expect(flexWrap).toBe('wrap');
    });
  });
});

// ─── Desktop Tests (1440px) ────────────────────────────────────────────────────

test.describe('Desktop Layout (1440px)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
  });

  test.describe('Navigation', () => {
    test('full sidenav is visible with labels', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const sidenav = page.locator('.sidenav-container');
      await expect(sidenav).toBeVisible();

      // Verify nav labels are visible
      const navLabels = page.locator('cst-sidenav .nav-label');
      await expect(navLabels).toHaveCount(4);
      await expect(navLabels.nth(0)).toHaveText('Dashboard');
    });

    test('sidenav is 260px wide', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const sidenav = page.locator('.sidenav-container');
      const width = await sidenav.evaluate((el) => el.getBoundingClientRect().width);
      expect(width).toBe(260);
    });

    test('bottom tab bar is not visible on desktop', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const tabBar = page.locator('.bottom-tab-bar');
      await expect(tabBar).not.toBeVisible();
    });

    test('icon rail is not visible on desktop', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const iconRail = page.locator('.icon-rail');
      await expect(iconRail).not.toBeVisible();
    });
  });

  test.describe('Toolbar', () => {
    test('toolbar height is 64px on desktop', async ({ page }) => {
      await page.goto('/dashboard');
      const toolbar = page.locator('cst-toolbar .toolbar');
      await toolbar.waitFor({ state: 'visible', timeout: 15000 });

      const height = await toolbar.evaluate((el) => getComputedStyle(el).height);
      expect(height).toBe('64px');
    });

    test('search and notification icons are visible on desktop', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });

      const desktopIcons = page.locator('.desktop-toolbar-icon');
      const count = await desktopIcons.count();
      expect(count).toBe(2);
      for (let i = 0; i < count; i++) {
        await expect(desktopIcons.nth(i)).toBeVisible();
      }
    });
  });

  test.describe('Dashboard', () => {
    test('stat cards display in a single row', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-stat-card').first().waitFor({ state: 'visible', timeout: 15000 });

      const statsRow = page.locator('.stats-row');
      const flexDirection = await statsRow.evaluate((el) => getComputedStyle(el).flexDirection);
      const flexWrap = await statsRow.evaluate((el) => getComputedStyle(el).flexWrap);
      expect(flexDirection).toBe('row');
      expect(flexWrap).toBe('nowrap');
    });

    test('page padding is 32px 40px on desktop', async ({ page }) => {
      await page.goto('/dashboard');
      await page.locator('cst-stat-card').first().waitFor({ state: 'visible', timeout: 15000 });

      const dashboard = page.locator('.dashboard');
      const paddingTop = await dashboard.evaluate((el) => getComputedStyle(el).paddingTop);
      const paddingLeft = await dashboard.evaluate((el) => getComputedStyle(el).paddingLeft);
      expect(paddingTop).toBe('32px');
      expect(paddingLeft).toBe('40px');
    });
  });

  test.describe('Events List', () => {
    test('all filter controls visible on desktop', async ({ page }) => {
      await page.goto('/events');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-event-card').first().waitFor({ state: 'visible', timeout: 10000 });

      await expect(page.locator('.search-field')).toBeVisible();
      await expect(page.locator('.select-field')).toBeVisible();
      await expect(page.locator('.date-field')).toBeVisible();
    });

    test('paginator shows items-per-page on desktop', async ({ page }) => {
      await page.goto('/events');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-event-card').first().waitFor({ state: 'visible', timeout: 10000 });

      await expect(page.locator('.pag-label')).toBeVisible();
      await expect(page.locator('.pag-select')).toBeVisible();
    });
  });

  test.describe('Event Detail', () => {
    test('metadata uses flex row layout on desktop', async ({ page }) => {
      await page.goto('/events/1');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-event-detail-card').waitFor({ state: 'visible', timeout: 10000 });

      const metaGrid = page.locator('.meta-grid');
      const display = await metaGrid.evaluate((el) => getComputedStyle(el).display);
      expect(display).toBe('flex');

      const direction = await metaGrid.evaluate((el) => getComputedStyle(el).flexDirection);
      expect(direction).toBe('row');
    });

    test('action buttons are inline on desktop', async ({ page }) => {
      await page.goto('/events/1');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-event-detail-card').waitFor({ state: 'visible', timeout: 10000 });

      const actionsRow = page.locator('.actions-row');
      const direction = await actionsRow.evaluate((el) => getComputedStyle(el).flexDirection);
      expect(direction).toBe('row');
    });
  });

  test.describe('Sources', () => {
    test('source cards display in a single row', async ({ page }) => {
      await page.goto('/sources');
      await page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
      await page.locator('cst-source-card').first().waitFor({ state: 'visible', timeout: 10000 });

      const grid = page.locator('.sources-grid');
      const direction = await grid.evaluate((el) => getComputedStyle(el).flexDirection);
      const wrap = await grid.evaluate((el) => getComputedStyle(el).flexWrap);
      expect(direction).toBe('row');
      expect(wrap).toBe('nowrap');
    });
  });
});
