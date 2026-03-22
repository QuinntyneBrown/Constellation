import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { SourcesService, SourceSummaryDto } from 'api';
import { SourceCardComponent } from 'components';

interface SourceDisplay {
  name: string;
  icon: string;
  iconColor: string;
  eventCount: number;
  lastSync: string;
  status: string;
  sharePercent: number;
}

const SOURCE_META: Record<string, { icon: string; iconColor: string }> = {
  eventbrite: { icon: 'confirmation_number', iconColor: '#BB86FC' },
  meetup: { icon: 'groups', iconColor: '#03DAC6' },
  websearch: { icon: 'travel_explore', iconColor: '#FFB74D' },
};

@Component({
  selector: 'app-sources-overview',
  standalone: true,
  imports: [SourceCardComponent],
  templateUrl: './sources-overview.component.html',
  styleUrl: './sources-overview.component.scss',
})
export class SourcesOverviewComponent implements OnInit {
  private readonly sourcesService = inject(SourcesService);

  private sources = signal<SourceSummaryDto[]>([]);
  loading = signal(false);

  activeCount = computed(() => this.sources().length);

  sourceDisplays = computed<SourceDisplay[]>(() => {
    const srcs = this.sources();
    const total = srcs.reduce((sum, s) => sum + s.eventCount, 0);

    return srcs.map((s) => {
      const key = s.source.toLowerCase();
      const meta = SOURCE_META[key] ?? { icon: 'cloud_sync', iconColor: '#B0B0B0' };
      const sharePercent = total > 0 ? Math.round((s.eventCount / total) * 100) : 0;

      return {
        name: s.source,
        icon: meta.icon,
        iconColor: meta.iconColor,
        eventCount: s.eventCount,
        lastSync: s.lastSyncTime ? this.relativeTime(s.lastSyncTime) : '–',
        status: 'Active',
        sharePercent,
      };
    });
  });

  private relativeTime(dateStr: string): string {
    const now = new Date();
    const then = new Date(dateStr);
    const diffMs = now.getTime() - then.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
  }

  ngOnInit(): void {
    this.loading.set(true);
    this.sourcesService.getSources().subscribe({
      next: (sources) => {
        this.sources.set(sources);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
