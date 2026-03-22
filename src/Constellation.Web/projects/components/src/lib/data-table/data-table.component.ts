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
  template: `
    <div class="table-card">
      <!-- Header Row -->
      <div class="table-header-row">
        @for (col of columns(); track col.key) {
          <div class="header-cell" [style.width]="col.width || 'auto'" [style.flex]="col.width ? 'none' : '1'">
            <span class="header-label">{{ col.label }}</span>
          </div>
        }
      </div>

      <!-- Data Rows -->
      @for (row of rows(); track row.id; let i = $index) {
        <div class="data-row" (click)="rowClicked.emit(row)">
          <div class="data-cell" [style.flex]="'1'">
            <span class="cell-title">{{ row.title }}</span>
          </div>
          <div class="data-cell" [style.width]="'140px'" [style.flex]="'none'">
            <span class="cell-text">{{ row.startDate | date:'MMM dd, yyyy' }}</span>
          </div>
          <div class="data-cell" [style.width]="'140px'" [style.flex]="'none'">
            <div class="source-chip" [style.color]="sourceColor(row.source)">
              <span class="chip-text">{{ row.source }}</span>
            </div>
          </div>
          <div class="data-cell cell-center" [style.width]="'100px'" [style.flex]="'none'">
            <div class="relevance-badge" [style.background]="badgeBg(row.relevanceScore)">
              <span class="badge-text" [style.color]="badgeFg(row.relevanceScore)">
                {{ row.relevanceScore }}
              </span>
            </div>
          </div>
        </div>
        @if (i < rows().length - 1) {
          <div class="row-divider"></div>
        }
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .table-card {
      background: #1E1E1E;
      border-radius: 12px;
      overflow: hidden;
    }
    .table-header-row {
      display: flex;
      background: #2C2C2C;
      padding: 14px 24px;
    }
    .header-cell { display: flex; align-items: center; }
    .header-label {
      color: #B0B0B0;
      font-family: Roboto, sans-serif;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .data-row {
      display: flex;
      align-items: center;
      padding: 14px 24px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .data-row:hover { background: #252525; }
    .data-cell { display: flex; align-items: center; }
    .cell-center { justify-content: center; }
    .cell-title {
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 13px;
    }
    .cell-text {
      color: #B0B0B0;
      font-family: Roboto, sans-serif;
      font-size: 13px;
    }
    .source-chip {
      background: #3A3A3A;
      border-radius: 12px;
      padding: 4px 12px;
    }
    .chip-text {
      font-family: Roboto, sans-serif;
      font-size: 12px;
      font-weight: 500;
    }
    .relevance-badge {
      border-radius: 4px;
      padding: 4px 10px;
    }
    .badge-text {
      font-family: Roboto, sans-serif;
      font-size: 12px;
      font-weight: 600;
    }
    .row-divider {
      height: 1px;
      background: #2C2C2C;
    }
  `,
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
    switch (source.toLowerCase()) {
      case 'eventbrite': return '#BB86FC';
      case 'meetup': return '#03DAC6';
      case 'websearch': return '#FFB74D';
      default: return '#B0B0B0';
    }
  }

  badgeBg(score: number): string {
    if (score >= 0.8) return '#4CAF50';
    if (score >= 0.6) return '#FFB74D';
    return '#F44336';
  }

  badgeFg(score: number): string {
    return '#121212';
  }
}
