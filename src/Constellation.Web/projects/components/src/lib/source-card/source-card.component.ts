import { Component, input } from '@angular/core';

@Component({
  selector: 'cst-source-card',
  standalone: true,
  template: `
    <div class="source-card">
      <div class="card-header">
        <div class="source-name">
          <div class="source-icon-circle">
            <span class="material-symbols-rounded source-icon" [style.color]="iconColor()">
              {{ icon() }}
            </span>
          </div>
          <span class="source-text">{{ name() }}</span>
        </div>
        <div class="status-chip" [class.inactive]="status() !== 'Active'">
          <span class="status-text">{{ status() }}</span>
        </div>
      </div>
      <div class="card-stats">
        <div class="stat-col">
          <span class="stat-value">{{ eventCount() }}</span>
          <span class="stat-label">Events</span>
        </div>
        <div class="stat-col">
          <span class="stat-value">{{ lastSync() }}</span>
          <span class="stat-label">Last Sync</span>
        </div>
      </div>
      <div class="progress-section">
        <div class="progress-label">
          <span class="progress-text">Event share</span>
          <span class="progress-text">{{ sharePercent() }}%</span>
        </div>
        <div class="progress-bg">
          <div
            class="progress-fg"
            [style.width.%]="sharePercent()"
            [style.background]="iconColor()"
          ></div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .source-card {
      background: #1E1E1E;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .source-name {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .source-icon-circle {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      background: #2C2C2C;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .source-icon { font-size: 20px; }
    .source-text {
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 18px;
      font-weight: 500;
    }
    .status-chip {
      background: #1B5E20;
      border-radius: 12px;
      padding: 4px 12px;
    }
    .status-chip.inactive {
      background: #424242;
    }
    .status-text {
      color: #4CAF50;
      font-family: Roboto, sans-serif;
      font-size: 12px;
      font-weight: 500;
    }
    .status-chip.inactive .status-text {
      color: #B0B0B0;
    }
    .card-stats {
      display: flex;
      gap: 24px;
    }
    .stat-col {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .stat-value {
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -1px;
    }
    .stat-label {
      color: #B0B0B0;
      font-family: Roboto, sans-serif;
      font-size: 12px;
    }
    .progress-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .progress-label {
      display: flex;
      justify-content: space-between;
    }
    .progress-text {
      color: #B0B0B0;
      font-family: Roboto, sans-serif;
      font-size: 12px;
    }
    .progress-bg {
      height: 6px;
      background: #2C2C2C;
      border-radius: 3px;
      overflow: hidden;
    }
    .progress-fg {
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s ease;
    }
  `,
})
export class SourceCardComponent {
  name = input<string>('');
  icon = input<string>('cloud_sync');
  iconColor = input<string>('#BB86FC');
  eventCount = input<number | string>(0);
  lastSync = input<string>('');
  status = input<string>('Active');
  sharePercent = input<number>(0);
}
