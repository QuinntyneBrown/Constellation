import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () =>
      import('domain').then((m) => m.AppShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('domain').then((m) => m.DashboardComponent),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('domain').then((m) => m.EventsListComponent),
      },
      {
        path: 'events/:id',
        loadComponent: () =>
          import('domain').then((m) => m.EventDetailComponent),
      },
      {
        path: 'sources',
        loadComponent: () =>
          import('domain').then((m) => m.SourcesOverviewComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('domain').then((m) => m.DashboardComponent), // placeholder
      },
    ],
  },
];
