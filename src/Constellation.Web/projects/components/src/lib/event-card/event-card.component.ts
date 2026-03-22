import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EventDto } from 'api';

@Component({
  selector: 'cst-event-card',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="event-card" (click)="eventClicked.emit(event())">
      <div class="card-top">
        <span class="card-title">{{ event().title }}</span>
        <div class="relevance-badge" [style.background]="badgeBackground()">
          <span class="badge-text" [style.color]="badgeColor()">{{ event().relevanceScore }}</span>
        </div>
      </div>
      <div class="card-meta">
        <span class="material-symbols-rounded meta-icon">calendar_today</span>
        <span class="meta-text">{{ event().startDate | date:'MMM dd, yyyy' }}</span>
        @if (event().location) {
          <span class="material-symbols-rounded meta-icon">location_on</span>
          <span class="meta-text">{{ event().location }}</span>
        }
        <div class="source-chip">
          <span class="chip-text">{{ event().source }}</span>
        </div>
      </div>
      @if (event().description) {
        <p class="card-desc">{{ event().description }}</p>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .event-card {
      background: #1E1E1E;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .event-card:hover {
      background: #252525;
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-title {
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 16px;
      font-weight: 500;
    }
    .relevance-badge {
      border-radius: 16px;
      padding: 4px 12px;
    }
    .badge-text {
      font-family: Roboto, sans-serif;
      font-size: 12px;
      font-weight: 500;
    }
    .card-meta {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .meta-icon {
      color: #6B6B6B;
      font-size: 16px;
    }
    .meta-text {
      color: #B0B0B0;
      font-family: Roboto, sans-serif;
      font-size: 13px;
    }
    .source-chip {
      background: #3A3A3A;
      border-radius: 16px;
      padding: 4px 12px;
    }
    .chip-text {
      color: #B0B0B0;
      font-family: Roboto, sans-serif;
      font-size: 12px;
    }
    .card-desc {
      color: #B0B0B0;
      font-family: Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  `,
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
