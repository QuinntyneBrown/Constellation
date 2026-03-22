import { Page, Locator } from '@playwright/test';

export class SourcesOverviewPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly pageSubtitle: Locator;
  readonly sourceCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('app-sources-overview .page-title');
    this.pageSubtitle = page.locator('.page-subtitle');
    this.sourceCards = page.locator('cst-source-card');
  }

  async goto() {
    await this.page.goto('/sources');
    await this.page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
    await this.sourceCards.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  getCardName(index: number): Locator {
    return this.sourceCards.nth(index).locator('.source-text');
  }

  getCardIcon(index: number): Locator {
    return this.sourceCards.nth(index).locator('.source-icon');
  }

  getCardEventCount(index: number): Locator {
    return this.sourceCards.nth(index).locator('.stat-value').first();
  }

  getCardStatus(index: number): Locator {
    return this.sourceCards.nth(index).locator('.status-text');
  }

  getCardProgressBar(index: number): Locator {
    return this.sourceCards.nth(index).locator('.progress-fg');
  }

  getCardIconCircle(index: number): Locator {
    return this.sourceCards.nth(index).locator('.source-icon');
  }
}
