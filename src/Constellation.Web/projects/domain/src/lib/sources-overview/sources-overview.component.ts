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
  template: `
    <div class="sources-page">
      <div class="page-header">
        <h1 class="page-title">Sources</h1>
        <span class="page-subtitle">{{ activeCount() }} active sources</span>
      </div>

      <div class="sources-grid">
        @for (src of sourceDisplays(); track src.name) {
          <cst-source-card
            [name]="src.name"
            [icon]="src.icon"
            [iconColor]="src.iconColor"
            [eventCount]="src.eventCount"
            [lastSync]="src.lastSync"
            [status]="src.status"
            [sharePercent]="src.sharePercent"
          />
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .sources-page {
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
    .page-subtitle {
      color: #B0B0B0;
      font-family: Roboto, sans-serif;
      font-size: 14px;
    }
    .sources-grid {
      display: flex;
      gap: 20px;
    }
    .sources-grid > * { flex: 1; }
  `,
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
