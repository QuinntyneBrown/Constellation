import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService, EventDto } from 'api';
import { EventDetailCardComponent } from 'components';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [EventDetailCardComponent],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss',
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
