import { Component, input, output } from '@angular/core';

export interface NavItem {
  route: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'cst-sidenav',
  standalone: true,
  template: `
    <nav class="sidenav">
      <div class="brand-row">
        <span class="material-symbols-rounded brand-icon">stars</span>
        <span class="brand-text">Constellation</span>
      </div>
      <div class="nav-divider"></div>
      <ul class="nav-list">
        @for (item of navItems; track item.route) {
          <li
            class="nav-item"
            [class.active]="item.route === activeRoute()"
            (click)="navItemClicked.emit(item.route)"
          >
            <span class="material-symbols-rounded nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
          </li>
        }
      </ul>
    </nav>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
    .sidenav {
      background: #1A1A1A;
      height: 100%;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
    .brand-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 8px 24px 8px;
    }
    .brand-icon {
      color: #BB86FC;
      font-size: 32px;
    }
    .brand-text {
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 20px;
      font-weight: 500;
      letter-spacing: -0.5px;
    }
    .nav-divider {
      height: 1px;
      background: #2C2C2C;
      width: 100%;
    }
    .nav-list {
      list-style: none;
      margin: 0;
      padding: 16px 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .nav-item:hover {
      background: #2C2C2C;
    }
    .nav-item .nav-icon {
      color: #B0B0B0;
      font-size: 24px;
    }
    .nav-item .nav-label {
      color: #B0B0B0;
      font-family: Roboto, sans-serif;
      font-size: 14px;
      font-weight: 400;
    }
    .nav-item.active {
      background: #2C2C2C;
      border-left: 3px solid #BB86FC;
      padding-left: 13px;
    }
    .nav-item.active .nav-icon {
      color: #BB86FC;
    }
    .nav-item.active .nav-label {
      color: #FFFFFF;
      font-weight: 500;
    }
  `,
})
export class SidenavComponent {
  activeRoute = input<string>('dashboard');
  navItemClicked = output<string>();

  readonly navItems: NavItem[] = [
    { route: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { route: 'events', label: 'Events', icon: 'event' },
    { route: 'sources', label: 'Sources', icon: 'cloud_sync' },
    { route: 'settings', label: 'Settings', icon: 'settings' },
  ];
}
