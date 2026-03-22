import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EventDto } from 'api';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
}

@Component({
  selector: 'cst-data-table',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent {
  columns = input<TableColumn[]>([
    { key: 'title', label: 'Title' },
    { key: 'date', label: 'Date', width: '140px' },
    { key: 'source', label: 'Source', width: '140px' },
    { key: 'relevance', label: 'Relevance', width: '100px' },
  ]);
  rows = input<EventDto[]>([]);
  rowClicked = output<EventDto>();

  sourceColor(source: string): string {
    return '#B0B0B0';
  }

  badgeBg(score: number): string {
    if (score >= 0.8) return '#1B5E20';
    if (score >= 0.6) return '#4A148C';
    return '#E65100';
  }

  badgeFg(score: number): string {
    if (score >= 0.8) return '#4CAF50';
    if (score >= 0.6) return '#BB86FC';
    return '#FFB74D';
  }
}
