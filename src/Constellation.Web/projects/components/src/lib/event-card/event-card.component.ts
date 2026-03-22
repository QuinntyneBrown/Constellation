import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EventDto } from 'api';

@Component({
  selector: 'cst-event-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
})
export class EventCardComponent {
  event = input.required<EventDto>();
  eventClicked = output<EventDto>();

  badgeBackground(): string {
    const score = this.event().relevanceScore;
    if (score >= 0.8) return '#1B5E20';
    if (score >= 0.6) return '#4A148C';
    return '#E65100';
  }

  badgeColor(): string {
    const score = this.event().relevanceScore;
    if (score >= 0.8) return '#4CAF50';
    if (score >= 0.6) return '#BB86FC';
    return '#FFB74D';
  }
}
