import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { SidenavComponent } from 'components';
import { ToolbarComponent } from 'components';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidenavComponent, ToolbarComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  private readonly router = inject(Router);
  sidenavOpen = signal(true);

  readonly tabItems = [
    { route: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { route: 'events', label: 'Events', icon: 'event' },
    { route: 'sources', label: 'Sources', icon: 'cloud_sync' },
    { route: 'settings', label: 'Settings', icon: 'settings' },
  ];

  activeRoute = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => {
        const segments = e.urlAfterRedirects.split('/').filter(Boolean);
        return segments[0] || 'dashboard';
      }),
    ),
    { initialValue: 'dashboard' },
  );

  onNavigate(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
