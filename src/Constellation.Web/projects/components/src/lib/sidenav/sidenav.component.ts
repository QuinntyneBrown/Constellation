import { Component, input, output } from '@angular/core';

export interface NavItem {
  route: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'cst-sidenav',
  standalone: true,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
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
