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
  template: `
    <cst-toolbar (menuToggled)="sidenavOpen.set(!sidenavOpen())" />
    <div class="body-row">
      @if (sidenavOpen()) {
        <div class="sidenav-container">
          <cst-sidenav
            [activeRoute]="activeRoute()"
            (navItemClicked)="onNavigate($event)"
          />
        </div>
      }
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #121212;
    }
    .body-row {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .sidenav-container {
      width: 260px;
      flex-shrink: 0;
    }
    .main-content {
      flex: 1;
      overflow-y: auto;
      background: #121212;
    }
  `,
})
export class AppShellComponent {
  private readonly router = inject(Router);
  sidenavOpen = signal(true);

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
