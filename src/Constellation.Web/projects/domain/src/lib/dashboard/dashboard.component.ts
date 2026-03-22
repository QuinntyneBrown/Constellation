import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService, SourcesService, EventDto, PagedResult, SourceSummaryDto } from 'api';
import { StatCardComponent } from 'components';
import { DataTableComponent } from 'components';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatCardComponent, DataTableComponent],
  template: `
    <div class="dashboard">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
        <button class="refresh-btn" (click)="loadData()">
          <span class="material-symbols-rounded">refresh</span>
          <span>Refresh</span>
        </button>
      </div>

      <!-- Stat Cards Row -->
      <div class="stats-row">
        <cst-stat-card
          icon="event"
          [value]="totalEvents()"
          label="Total Events"
          [trend]="'+12%'"
          [trendUp]="true"
        />
        <cst-stat-card
          icon="cloud_sync"
          [value]="sourcesActive()"
          label="Sources Active"
          [trend]="'+3'"
          [trendUp]="true"
        />
        <cst-stat-card
          icon="date_range"
          [value]="eventsThisWeek()"
          label="Events This Week"
          [trend]="'+28%'"
          [trendUp]="true"
        />
        <cst-stat-card
          icon="analytics"
          [value]="avgRelevance()"
          label="Avg Relevance"
          [trend]="'+5%'"
          [trendUp]="true"
        />
      </div>

      <!-- Recent Events Section -->
      <div class="recent-section">
        <div class="section-header">
          <h2 class="section-title">Recent Events</h2>
          <button class="view-all-btn" (click)="goToEvents()">
            <span>View All Events</span>
            <span class="material-symbols-rounded">arrow_forward</span>
          </button>
        </div>
        <cst-data-table
          [rows]="recentEvents()"
          (rowClicked)="onEventClick($event)"
        />
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .dashboard {
      padding: 32px 40px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .page-title {
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 28px;
      font-weight: 400;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .refresh-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #1E1E1E;
      border: none;
      border-radius: 8px;
      padding: 10px 20px;
      color: #B0B0B0;
      font-family: Roboto, sans-serif;
      font-size: 14px;
      cursor: pointer;
    }
    .refresh-btn:hover { background: #2C2C2C; }
    .refresh-btn .material-symbols-rounded { font-size: 18px; }
    .stats-row {
      display: flex;
      gap: 20px;
    }
    .stats-row > * { flex: 1; }
    .recent-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-title {
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 20px;
      font-weight: 500;
      margin: 0;
    }
    .view-all-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #BB86FC;
      border: none;
      border-radius: 8px;
      padding: 10px 24px;
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    .view-all-btn .material-symbols-rounded { font-size: 18px; }
  `,
})
export class DashboardComponent implements OnInit {
  private readonly eventsService = inject(EventsService);
  private readonly sourcesService = inject(SourcesService);
  private readonly router = inject(Router);

  recentEvents = signal<EventDto[]>([]);
  totalEvents = signal('0');
  sourcesActive = signal('0');
  eventsThisWeek = signal('0');
  avgRelevance = signal('0');
  loading = signal(false);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    this.eventsService.getEvents({ page: 1, pageSize: 5 }).subscribe({
      next: (result) => {
        this.recentEvents.set(result.items);
        this.totalEvents.set(result.totalCount.toLocaleString());

        if (result.items.length > 0) {
          const avg = result.items.reduce((sum, e) => sum + e.relevanceScore, 0) / result.items.length;
          this.avgRelevance.set(avg.toFixed(1));
        }

        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.sourcesService.getSources().subscribe({
      next: (sources) => {
        this.sourcesActive.set(sources.length.toString());

        const totalFromSources = sources.reduce((sum, s) => sum + s.eventCount, 0);
        if (totalFromSources > 0) {
          this.totalEvents.set(totalFromSources.toLocaleString());
        }
      },
    });
  }

  goToEvents(): void {
    this.router.navigate(['/events']);
  }

  onEventClick(event: EventDto): void {
    this.router.navigate(['/events', event.id]);
  }
}
