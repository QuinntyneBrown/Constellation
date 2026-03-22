import { Component, input } from '@angular/core';

@Component({
  selector: 'cst-stat-card',
  standalone: true,
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  icon = input<string>('event');
  value = input<string>('0');
  label = input<string>('');
  trend = input<string>('+0%');
  trendUp = input<boolean>(true);
}
