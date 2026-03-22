import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EventsService, SourcesService, EventDto, SourceSummaryDto } from 'api';
import { EventCardComponent } from 'components';
import { PaginatorComponent } from 'components';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    EventCardComponent,
    PaginatorComponent,
  ],
  template: `
    <div class="events-page">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">Events</h1>
        <div class="count-badge">
          <span>{{ totalCount().toLocaleString() }}</span>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="search-field">
          <span class="material-symbols-rounded search-icon">search</span>
          <input
            type="text"
            class="search-input"
            placeholder="Search events..."
            [ngModel]="keyword()"
            (ngModelChange)="onKeywordChange($event)"
          />
        </div>
        <div class="select-field">
          <select class="source-select" [ngModel]="sourceFilter()" (ngModelChange)="onSourceChange($event)">
            <option value="">All Sources</option>
            @for (src of sources(); track src.source) {
              <option [value]="src.source">{{ src.source }}</option>
            }
          </select>
          <span class="material-symbols-rounded select-arrow">arrow_drop_down</span>
        </div>
        <div class="date-field">
          <input
            type="date"
            class="date-input"
            [ngModel]="dateFilter()"
            (ngModelChange)="onDateChange($event)"
          />
          <span class="material-symbols-rounded date-icon">calendar_today</span>
        </div>
      </div>

      <!-- Event Cards -->
      <div class="events-list">
        @for (event of events(); track event.id) {
          <cst-event-card
            [event]="event"
            (eventClicked)="onEventClick($event)"
          />
        }
        @if (!loading() && events().length === 0) {
          <div class="empty-state">No events found.</div>
        }
      </div>

      <!-- Paginator -->
      <cst-paginator
        [totalItems]="totalCount()"
        [pageSize]="pageSize()"
        [currentPage]="currentPage()"
        (pageChanged)="onPageChange($event)"
        (pageSizeChanged)="onPageSizeChange($event)"
      />
    </div>
  `,
  styles: `
    :host { display: block; }
    .events-page {
      padding: 32px 40px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .page-title {
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 28px;
      font-weight: 400;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .count-badge {
      background: #2C2C2C;
      border-radius: 16px;
      padding: 6px 14px;
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
    }
    .filter-bar {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .search-field {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
      background: #1E1E1E;
      border-radius: 8px;
      padding: 0 16px;
      height: 48px;
    }
    .search-icon { color: #6B6B6B; font-size: 20px; }
    .search-input {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 14px;
    }
    .search-input::placeholder { color: #6B6B6B; }
    .select-field {
      position: relative;
      width: 180px;
    }
    .source-select {
      width: 100%;
      height: 48px;
      background: #1E1E1E;
      border: none;
      border-radius: 8px;
      padding: 0 36px 0 16px;
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 14px;
      appearance: none;
      cursor: pointer;
    }
    .select-arrow {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #6B6B6B;
      font-size: 20px;
      pointer-events: none;
    }
    .date-field {
      position: relative;
      width: 200px;
    }
    .date-input {
      width: 100%;
      height: 48px;
      background: #1E1E1E;
      border: none;
      border-radius: 8px;
      padding: 0 36px 0 16px;
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 14px;
      color-scheme: dark;
    }
    .date-icon {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #6B6B6B;
      font-size: 20px;
      pointer-events: none;
    }
    .events-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .empty-state {
      text-align: center;
      color: #6B6B6B;
      font-family: Roboto, sans-serif;
      font-size: 16px;
      padding: 48px;
    }
  `,
})
export class EventsListComponent implements OnInit {
  private readonly eventsService = inject(EventsService);
  private readonly sourcesService = inject(SourcesService);
  private readonly router = inject(Router);

  events = signal<EventDto[]>([]);
  sources = signal<SourceSummaryDto[]>([]);
  totalCount = signal(0);
  currentPage = signal(1);
  pageSize = signal(20);
  keyword = signal('');
  sourceFilter = signal('');
  dateFilter = signal('');
  loading = signal(false);

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.fetchEvents();
    this.sourcesService.getSources().subscribe({
      next: (s) => this.sources.set(s),
    });
  }

  onKeywordChange(value: string): void {
    this.keyword.set(value);
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage.set(1);
      this.fetchEvents();
    }, 300);
  }

  onSourceChange(value: string): void {
    this.sourceFilter.set(value);
    this.currentPage.set(1);
    this.fetchEvents();
  }

  onDateChange(value: string): void {
    this.dateFilter.set(value);
    this.currentPage.set(1);
    this.fetchEvents();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.fetchEvents();
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.fetchEvents();
  }

  onEventClick(event: EventDto): void {
    this.router.navigate(['/events', event.id]);
  }

  private fetchEvents(): void {
    this.loading.set(true);
    this.eventsService
      .getEvents({
        page: this.currentPage(),
        pageSize: this.pageSize(),
        keyword: this.keyword() || undefined,
        source: this.sourceFilter() || undefined,
        fromDate: this.dateFilter() || undefined,
      })
      .subscribe({
        next: (result) => {
          this.events.set(result.items);
          this.totalCount.set(result.totalCount);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
