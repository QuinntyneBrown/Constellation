import { Page } from '@playwright/test';
import { mockPagedEvents, mockSources, mockEvents } from './mock-data';

export async function mockApiRoutes(page: Page): Promise<void> {
  // Mock GET /api/events/search (must be before /api/events to match first)
  await page.route('**/api/events/search**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockEvents.slice(0, 2)),
    });
  });

  // Mock GET /api/events/:id (numeric path segment)
  await page.route(/\/api\/events\/\d+$/, (route) => {
    const url = route.request().url();
    const match = url.match(/\/api\/events\/(\d+)$/);
    const id = match ? parseInt(match[1], 10) : 1;
    const event = mockEvents.find((e) => e.id === id) ?? mockEvents[0];
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(event),
    });
  });

  // Mock GET /api/events (with or without query params)
  await page.route(/\/api\/events(\?|$)/, (route) => {
    const url = route.request().url();
    // Don't intercept /search or /:id
    if (url.includes('/search') || /\/events\/\d+/.test(url)) {
      return route.fallback();
    }
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockPagedEvents),
    });
  });

  // Mock GET /api/sources
  await page.route('**/api/sources', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSources),
    });
  });
}
