import { test, expect } from '@playwright/test';
import { mockApiRoutes } from '../fixtures/api-mock';
import { SourcesOverviewPage } from '../pages/sources-overview.page';

test.describe('Sources Overview', () => {
  let sources: SourcesOverviewPage;

  test.beforeEach(async ({ page }) => {
    await mockApiRoutes(page);
    sources = new SourcesOverviewPage(page);
    await sources.goto();
  });

  test('renders the "Sources" title', async () => {
    await expect(sources.pageTitle).toHaveText('Sources');
  });

  test('renders subtitle with active source count', async () => {
    await expect(sources.pageSubtitle).toHaveText('3 active sources');
  });

  test('renders three source cards', async () => {
    await expect(sources.sourceCards).toHaveCount(3);
  });

  test('source cards have correct names', async () => {
    await expect(sources.getCardName(0)).toHaveText('Eventbrite');
    await expect(sources.getCardName(1)).toHaveText('Meetup');
    await expect(sources.getCardName(2)).toHaveText('WebSearch');
  });

  test('source cards have correct icons', async () => {
    await expect(sources.getCardIcon(0)).toHaveText('confirmation_number');
    await expect(sources.getCardIcon(1)).toHaveText('groups');
    await expect(sources.getCardIcon(2)).toHaveText('travel_explore');
  });

  test('source cards show event counts', async () => {
    await expect(sources.getCardEventCount(0)).toHaveText('842');
    await expect(sources.getCardEventCount(1)).toHaveText('298');
    await expect(sources.getCardEventCount(2)).toHaveText('144');
  });

  test('source cards show "Active" status', async () => {
    await expect(sources.getCardStatus(0)).toHaveText('Active');
    await expect(sources.getCardStatus(1)).toHaveText('Active');
    await expect(sources.getCardStatus(2)).toHaveText('Active');
  });

  test('progress bars are present on each card', async () => {
    for (let i = 0; i < 3; i++) {
      await expect(sources.getCardProgressBar(i)).toBeVisible();
    }
  });

  test('Eventbrite icon has correct color (#BB86FC)', async () => {
    const color = await sources.getCardIconCircle(0).evaluate(
      (el) => getComputedStyle(el).color,
    );
    expect(color).toBe('rgb(187, 134, 252)');
  });

  test('Meetup icon has correct color (#03DAC6)', async () => {
    const color = await sources.getCardIconCircle(1).evaluate(
      (el) => getComputedStyle(el).color,
    );
    expect(color).toBe('rgb(3, 218, 198)');
  });

  test('WebSearch icon has correct color (#FFB74D)', async () => {
    const color = await sources.getCardIconCircle(2).evaluate(
      (el) => getComputedStyle(el).color,
    );
    expect(color).toBe('rgb(255, 183, 77)');
  });
});
