import { Component, input } from '@angular/core';

@Component({
  selector: 'cst-source-card',
  standalone: true,
  templateUrl: './source-card.component.html',
  styleUrl: './source-card.component.scss',
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
