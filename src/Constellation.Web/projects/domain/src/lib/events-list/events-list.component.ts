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
  templateUrl: './events-list.component.html',
  styleUrl: './events-list.component.scss',
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
