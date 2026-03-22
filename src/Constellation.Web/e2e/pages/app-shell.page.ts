import { Page, Locator } from '@playwright/test';

export class AppShellPage {
  readonly page: Page;
  readonly toolbar: Locator;
  readonly brandText: Locator;
  readonly menuButton: Locator;
  readonly sidenavContainer: Locator;
  readonly navItems: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toolbar = page.locator('cst-toolbar');
    this.brandText = page.locator('cst-toolbar .toolbar-title');
    this.menuButton = page.locator('cst-toolbar .icon-btn').first();
    this.sidenavContainer = page.locator('.sidenav-container');
    this.navItems = page.locator('cst-sidenav .nav-item');
    this.mainContent = page.locator('.main-content');
  }

  async goto(path = '/dashboard') {
    await this.page.goto(path);
    await this.toolbar.waitFor({ state: 'visible', timeout: 15000 });
  }

  async clickNavItem(label: string) {
    await this.navItems.filter({ hasText: label }).click();
  }

  async toggleMenu() {
    await this.menuButton.click();
  }

  async getNavItemLabels(): Promise<string[]> {
    return this.navItems.locator('.nav-label').allTextContents();
  }

  getNavIcon(label: string): Locator {
    return this.navItems.filter({ hasText: label }).locator('.nav-icon');
  }

  getBrandIcon(): Locator {
    return this.page.locator('cst-sidenav .brand-icon');
  }
}
