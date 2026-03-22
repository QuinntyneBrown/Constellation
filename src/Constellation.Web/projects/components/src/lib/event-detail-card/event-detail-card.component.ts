import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EventDto } from 'api';

@Component({
  selector: 'cst-event-detail-card',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="detail-card">
      <!-- Title Row -->
      <div class="title-row">
        <span class="detail-title">{{ event().title }}</span>
        <div class="relevance-badge">
          <span class="material-symbols-rounded badge-icon">star</span>
          <span class="badge-text">{{ event().relevanceScore }} Relevance</span>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Metadata Grid -->
      <div class="meta-grid">
        <div class="meta-col">
          <div class="meta-item">
            <span class="material-symbols-rounded meta-icon">calendar_today</span>
            <div class="meta-info">
              <span class="meta-label">Date</span>
              <span class="meta-value">{{ event().startDate | date:'MMM dd, yyyy' }}</span>
            </div>
          </div>
          <div class="meta-item">
            <span class="material-symbols-rounded meta-icon">location_on</span>
            <div class="meta-info">
              <span class="meta-label">Location</span>
              <span class="meta-value">{{ event().location || 'Not specified' }}</span>
            </div>
          </div>
        </div>
        <div class="meta-col">
          <div class="meta-item">
            <span class="material-symbols-rounded meta-icon">cloud_sync</span>
            <div class="meta-info">
              <span class="meta-label">Source</span>
              <span class="meta-value">{{ event().source }}</span>
            </div>
          </div>
          <div class="meta-item">
            <span class="material-symbols-rounded meta-icon">analytics</span>
            <div class="meta-info">
              <span class="meta-label">Relevance</span>
              <span class="meta-value">{{ event().relevanceScore }} / 10</span>
            </div>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Description -->
      <div class="desc-section">
        <span class="section-label">Description</span>
        <p class="desc-text">{{ event().description }}</p>
      </div>

      <div class="divider"></div>

      <!-- Tags -->
      @if (event().tags.length > 0) {
        <div class="tags-section">
          <span class="section-label">Tags</span>
          <div class="tags-row">
            @for (tag of event().tags; track tag) {
              <div class="tag-chip">
                <span class="tag-text">{{ tag }}</span>
              </div>
            }
          </div>
        </div>
        <div class="divider"></div>
      }

      <!-- Actions -->
      <div class="actions-row">
        <button class="btn-stroked" (click)="share.emit()">
          <span class="material-symbols-rounded btn-icon">share</span>
          <span>Share</span>
        </button>
        <button class="btn-filled" (click)="openLink.emit()">
          <span class="material-symbols-rounded btn-icon">open_in_new</span>
          <span>Open Link</span>
        </button>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .detail-card {
      background: #1E1E1E;
      border-radius: 12px;
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .detail-title {
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 24px;
      letter-spacing: -0.5px;
    }
    .relevance-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #1B5E20;
      border-radius: 20px;
      padding: 6px 16px;
    }
    .badge-icon {
      color: #4CAF50;
      font-size: 16px;
    }
    .badge-text {
      color: #4CAF50;
      font-family: Roboto, sans-serif;
      font-size: 13px;
      font-weight: 500;
    }
    .divider {
      height: 1px;
      background: #2C2C2C;
    }
    .meta-grid {
      display: flex;
      gap: 40px;
    }
    .meta-col {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .meta-icon {
      color: #BB86FC;
      font-size: 20px;
    }
    .meta-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .meta-label {
      color: #6B6B6B;
      font-family: Roboto, sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .meta-value {
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 14px;
    }
    .desc-section, .tags-section {
      display: flex;
      flex-direction: column;
    }
    .desc-section { gap: 8px; }
    .tags-section { gap: 12px; }
    .section-label {
      color: #6B6B6B;
      font-family: Roboto, sans-serif;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .desc-text {
      color: #B0B0B0;
      font-family: Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      margin: 0;
    }
    .tags-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .tag-chip {
      background: #3A3A3A;
      border-radius: 16px;
      padding: 6px 14px;
    }
    .tag-text {
      color: #B0B0B0;
      font-family: Roboto, sans-serif;
      font-size: 12px;
    }
    .actions-row {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
    }
    .btn-stroked, .btn-filled {
      display: flex;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
      padding: 12px 24px;
      cursor: pointer;
      font-family: Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      border: none;
    }
    .btn-stroked {
      background: transparent;
      border: 1px solid #B0B0B0;
      color: #B0B0B0;
    }
    .btn-stroked .btn-icon { color: #B0B0B0; font-size: 18px; }
    .btn-filled {
      background: #03DAC6;
      color: #121212;
    }
    .btn-filled .btn-icon { color: #121212; font-size: 18px; }
  `,
})
export class EventDetailCardComponent {
  event = input.required<EventDto>();
  openLink = output<void>();
  share = output<void>();
}
