import { test, expect } from '@playwright/test';
import { mockApiRoutes } from '../fixtures/api-mock';
import { EventDetailPage } from '../pages/event-detail.page';
import { mockEventDetail } from '../fixtures/mock-data';

test.describe('Event Detail', () => {
  let detail: EventDetailPage;

  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
    detail = new EventDetailPage(page);
    await detail.goto(1);
  });

  test('"Back to Events" link navigates to /events', async ({ page }) => {
    await detail.clickBack();
    await expect(page).toHaveURL(/\/events$/);
  });

  test('renders the event title', async () => {
    await expect(detail.eventTitle).toHaveText(mockEventDetail.title);
  });

  test('renders the relevance badge', async () => {
    await expect(detail.relevanceBadge).toBeVisible();
    await expect(detail.relevanceBadge).toContainText('9.2');
  });

  test('metadata has correct icons', async () => {
    await expect(detail.getMetaIcon(0)).toHaveText('calendar_today');
    await expect(detail.getMetaIcon(1)).toHaveText('location_on');
    await expect(detail.getMetaIcon(2)).toHaveText('cloud_sync');
    await expect(detail.getMetaIcon(3)).toHaveText('analytics');
  });

  test('description section displays event description', async () => {
    await expect(detail.descriptionText).toContainText(
      'Annual conference celebrating Black excellence in STEM fields',
    );
  });

  test('tags are rendered as chip elements', async () => {
    await expect(detail.tagChips).toHaveCount(5);
    await expect(detail.getTagText(0)).toHaveText('STEM');
    await expect(detail.getTagText(1)).toHaveText('Aerospace');
    await expect(detail.getTagText(2)).toHaveText('Defence');
  });

  test('"Open Link" button is present', async () => {
    await expect(detail.openLinkButton).toBeVisible();
    await expect(detail.openLinkButton).toContainText('Open Link');
  });

  test('"Share" button is present', async () => {
    await expect(detail.shareButton).toBeVisible();
    await expect(detail.shareButton).toContainText('Share');
  });

  test('"Open Link" button has teal background (#03DAC6)', async () => {
    const bg = await detail.openLinkButton.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    // #03DAC6 = rgb(3, 218, 198)
    expect(bg).toBe('rgb(3, 218, 198)');
  });
});
