import { Page, Locator } from '@playwright/test';

export class EventsListPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly countBadge: Locator;
  readonly searchInput: Locator;
  readonly searchIcon: Locator;
  readonly sourceSelect: Locator;
  readonly dateInput: Locator;
  readonly eventCards: Locator;
  readonly paginator: Locator;
  readonly paginatorInfo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('app-events-list .page-title');
    this.countBadge = page.locator('.count-badge');
    this.searchInput = page.locator('.search-input');
    this.searchIcon = page.locator('.search-icon');
    this.sourceSelect = page.locator('.source-select');
    this.dateInput = page.locator('.date-input');
    this.eventCards = page.locator('cst-event-card');
    this.paginator = page.locator('cst-paginator');
    this.paginatorInfo = page.locator('cst-paginator .pag-info');
  }

  async goto() {
    await this.page.goto('/events');
    await this.page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
    await this.eventCards.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  getEventCardTitle(index: number): Locator {
    return this.eventCards.nth(index).locator('.card-title');
  }

  getEventCardBadge(index: number): Locator {
    return this.eventCards.nth(index).locator('.relevance-badge');
  }

  getEventCardMeta(index: number): Locator {
    return this.eventCards.nth(index).locator('.card-meta');
  }

  getEventCardDesc(index: number): Locator {
    return this.eventCards.nth(index).locator('.card-desc');
  }

  getEventCardSourceChip(index: number): Locator {
    return this.eventCards.nth(index).locator('.source-chip');
  }

  async clickEventCard(index: number) {
    await this.eventCards.nth(index).click();
  }

  async searchFor(text: string) {
    await this.searchInput.fill(text);
    await this.page.waitForTimeout(400);
  }
}
