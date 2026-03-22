import { Page, Locator } from '@playwright/test';

export class EventDetailPage {
  readonly page: Page;
  readonly backLink: Locator;
  readonly detailCard: Locator;
  readonly eventTitle: Locator;
  readonly relevanceBadge: Locator;
  readonly metaItems: Locator;
  readonly metaIcons: Locator;
  readonly descriptionText: Locator;
  readonly tagChips: Locator;
  readonly openLinkButton: Locator;
  readonly shareButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backLink = page.locator('.back-link');
    this.detailCard = page.locator('cst-event-detail-card');
    this.eventTitle = page.locator('cst-event-detail-card .detail-title');
    this.relevanceBadge = page.locator('cst-event-detail-card .relevance-badge');
    this.metaItems = page.locator('cst-event-detail-card .meta-item');
    this.metaIcons = page.locator('cst-event-detail-card .meta-icon');
    this.descriptionText = page.locator('cst-event-detail-card .desc-text');
    this.tagChips = page.locator('cst-event-detail-card .tag-chip');
    this.openLinkButton = page.locator('cst-event-detail-card .btn-filled');
    this.shareButton = page.locator('cst-event-detail-card .btn-stroked');
  }

  async goto(id = 1) {
    await this.page.goto(`/events/${id}`);
    await this.page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
    await this.detailCard.waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickBack() {
    await this.backLink.click();
  }

  getMetaIcon(index: number): Locator {
    return this.metaIcons.nth(index);
  }

  getTagText(index: number): Locator {
    return this.tagChips.nth(index).locator('.tag-text');
  }
}
