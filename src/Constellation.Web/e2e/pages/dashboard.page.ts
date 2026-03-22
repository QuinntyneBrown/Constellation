import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly statCards: Locator;
  readonly refreshButton: Locator;
  readonly sectionTitle: Locator;
  readonly viewAllButton: Locator;
  readonly dataTable: Locator;
  readonly tableRows: Locator;
  readonly tableHeaderCells: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('app-dashboard .page-title');
    this.statCards = page.locator('cst-stat-card');
    this.refreshButton = page.locator('.refresh-btn');
    this.sectionTitle = page.locator('.section-title');
    this.viewAllButton = page.locator('.view-all-btn');
    this.dataTable = page.locator('cst-data-table');
    this.tableRows = page.locator('cst-data-table .data-row');
    this.tableHeaderCells = page.locator('cst-data-table .header-label');
  }

  async goto() {
    await this.page.goto('/dashboard');
    await this.page.locator('cst-toolbar').waitFor({ state: 'visible', timeout: 15000 });
    // Wait for data to load
    await this.statCards.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  getStatCardByLabel(label: string): Locator {
    return this.statCards.filter({ hasText: label });
  }

  getStatCardIcon(index: number): Locator {
    return this.statCards.nth(index).locator('.stat-icon');
  }

  getStatCardValue(index: number): Locator {
    return this.statCards.nth(index).locator('.stat-value');
  }
}
