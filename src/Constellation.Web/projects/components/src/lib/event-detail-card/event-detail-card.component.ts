import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EventDto } from 'api';

@Component({
  selector: 'cst-event-detail-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './event-detail-card.component.html',
  styleUrl: './event-detail-card.component.scss',
})
export class EventDetailCardComponent {
  event = input.required<EventDto>();
  openLink = output<void>();
  share = output<void>();
}
