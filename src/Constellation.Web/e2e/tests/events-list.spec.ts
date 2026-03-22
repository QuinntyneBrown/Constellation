import { test, expect } from '@playwright/test';
import { mockApiRoutes } from '../fixtures/api-mock';
import { EventsListPage } from '../pages/events-list.page';

test.describe('Events List', () => {
  let eventsPage: EventsListPage;

  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
    eventsPage = new EventsListPage(page);
    await eventsPage.goto();
  });

  test('renders the "Events" title', async () => {
    await expect(eventsPage.pageTitle).toHaveText('Events');
  });

  test('renders the count badge with total count', async () => {
    await expect(eventsPage.countBadge).toBeVisible();
  });

  test('filter bar has search input', async () => {
    await expect(eventsPage.searchInput).toBeVisible();
    await expect(eventsPage.searchInput).toHaveAttribute(
      'placeholder',
      'Search events...',
    );
  });

  test('filter bar has search icon with "search" text', async () => {
    await expect(eventsPage.searchIcon).toBeVisible();
    await expect(eventsPage.searchIcon).toHaveText('search');
  });

  test('filter bar has source dropdown', async () => {
    await expect(eventsPage.sourceSelect).toBeVisible();
  });

  test('filter bar has date input', async () => {
    await expect(eventsPage.dateInput).toBeVisible();
  });

  test('renders event cards from API', async () => {
    await expect(eventsPage.eventCards).toHaveCount(5);
  });

  test('event card displays title', async () => {
    await expect(eventsPage.getEventCardTitle(0)).toHaveText(
      'BEYA STEM Conference 2026',
    );
  });

  test('event card displays relevance badge', async () => {
    await expect(eventsPage.getEventCardBadge(0)).toBeVisible();
  });

  test('event card displays source chip', async () => {
    await expect(eventsPage.getEventCardSourceChip(0)).toContainText(
      'Eventbrite',
    );
  });

  test('event card displays description', async () => {
    await expect(eventsPage.getEventCardDesc(0)).toContainText(
      'Annual conference celebrating Black excellence',
    );
  });

  test('paginator is visible', async () => {
    await expect(eventsPage.paginator).toBeVisible();
  });

  test('paginator displays range info', async () => {
    await expect(eventsPage.paginatorInfo).toBeVisible();
  });

  test('clicking event card navigates to detail', async ({ page }) => {
    await eventsPage.clickEventCard(0);
    await expect(page).toHaveURL(/\/events\/1$/);
  });

  test('event cards have correct spacing (gap: 16px)', async ({ page }) => {
    const gap = await page.locator('.events-list').evaluate(
      (el) => getComputedStyle(el).gap,
    );
    expect(gap).toBe('16px');
  });

  test('event card meta row has calendar icon', async () => {
    const metaIcons = eventsPage.eventCards.first().locator('.meta-icon');
    await expect(metaIcons.first()).toHaveText('calendar_today');
  });
});
