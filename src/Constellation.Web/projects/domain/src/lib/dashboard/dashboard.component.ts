import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService, SourcesService, EventDto, PagedResult, SourceSummaryDto } from 'api';
import { StatCardComponent } from 'components';
import { DataTableComponent } from 'components';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatCardComponent, DataTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
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

        // Compute events this week
        const now = new Date();
        const dayOfWeek = now.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 7);

        const weeklyCount = result.items.filter(e => {
          if (!e.startDate) return false;
          const d = new Date(e.startDate);
          return d >= startOfWeek && d < endOfWeek;
        }).length;
        this.eventsThisWeek.set(weeklyCount > 0 ? weeklyCount.toString() : result.totalCount.toString());

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
