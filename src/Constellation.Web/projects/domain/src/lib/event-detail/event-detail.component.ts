import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService, EventDto } from 'api';
import { EventDetailCardComponent } from 'components';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [EventDetailCardComponent],
  template: `
    <div class="detail-page">
      <!-- Back Link -->
      <button class="back-link" (click)="goBack()">
        <span class="material-symbols-rounded back-icon">arrow_back</span>
        <span class="back-text">Back to Events</span>
      </button>

      @if (event(); as ev) {
        <cst-event-detail-card
          [event]="ev"
          (openLink)="onOpenLink()"
          (share)="onShare()"
        />
      }

      @if (loading()) {
        <div class="loading-state">Loading event...</div>
      }

      @if (!loading() && !event()) {
        <div class="error-state">Event not found.</div>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .detail-page {
      padding: 32px 40px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .back-link {
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
    }
    .back-icon {
      color: #B0B0B0;
      font-size: 20px;
    }
    .back-text {
      color: #B0B0B0;
      font-family: Roboto, sans-serif;
      font-size: 14px;
    }
    .back-link:hover .back-icon,
    .back-link:hover .back-text {
      color: #FFFFFF;
    }
    .loading-state, .error-state {
      text-align: center;
      color: #6B6B6B;
      font-family: Roboto, sans-serif;
      font-size: 16px;
      padding: 48px;
    }
  `,
})
export class EventDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventsService = inject(EventsService);

  event = signal<EventDto | null>(null);
  loading = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.loading.set(true);
    this.eventsService.getEvent(id).subscribe({
      next: (ev) => {
        this.event.set(ev);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  onOpenLink(): void {
    const ev = this.event();
    if (ev?.url) {
      window.open(ev.url, '_blank', 'noopener');
    }
  }

  onShare(): void {
    const ev = this.event();
    if (ev?.url) {
      navigator.clipboard.writeText(ev.url);
    }
  }
}
