import { Component, input } from '@angular/core';

@Component({
  selector: 'cst-stat-card',
  standalone: true,
  template: `
    <div class="stat-card">
      <div class="stat-top">
        <div class="icon-circle">
          <span class="material-symbols-rounded stat-icon">{{ icon() }}</span>
        </div>
        <div class="stat-trend" [class.down]="!trendUp()">
          <span class="material-symbols-rounded trend-icon">
            {{ trendUp() ? 'trending_up' : 'trending_down' }}
          </span>
          <span class="trend-text">{{ trend() }}</span>
        </div>
      </div>
      <div class="stat-bottom">
        <span class="stat-value">{{ value() }}</span>
        <span class="stat-label">{{ label() }}</span>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .stat-card {
      background: #1E1E1E;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .stat-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .icon-circle {
      width: 48px;
      height: 48px;
      border-radius: 24px;
      background: #2C2C2C;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stat-icon {
      color: #BB86FC;
      font-size: 24px;
    }
    .stat-trend {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .trend-icon {
      color: #4CAF50;
      font-size: 16px;
    }
    .trend-text {
      color: #4CAF50;
      font-family: Roboto, sans-serif;
      font-size: 12px;
      font-weight: 500;
    }
    .stat-trend.down .trend-icon,
    .stat-trend.down .trend-text {
      color: #F44336;
    }
    .stat-bottom {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .stat-value {
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 32px;
      font-weight: 600;
      letter-spacing: -1px;
    }
    .stat-label {
      color: #B0B0B0;
      font-family: Roboto, sans-serif;
      font-size: 14px;
      font-weight: 400;
    }
  `,
})
export class StatCardComponent {
  icon = input<string>('event');
  value = input<string>('0');
  label = input<string>('');
  trend = input<string>('+0%');
  trendUp = input<boolean>(true);
}
