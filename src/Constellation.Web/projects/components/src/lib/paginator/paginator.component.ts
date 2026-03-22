import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'cst-paginator',
  standalone: true,
  template: `
    <div class="paginator">
      <span class="pag-label">Items per page:</span>
      <div class="pag-select" (click)="cyclePagSize()">
        <span class="pag-select-text">{{ pageSize() }}</span>
        <span class="material-symbols-rounded pag-arrow">arrow_drop_down</span>
      </div>
      <span class="pag-info">{{ rangeLabel() }}</span>
      <button
        class="pag-btn"
        [disabled]="currentPage() <= 1"
        (click)="pageChanged.emit(currentPage() - 1)"
      >
        <span class="material-symbols-rounded">chevron_left</span>
      </button>
      <button
        class="pag-btn"
        [disabled]="currentPage() >= totalPages()"
        (click)="pageChanged.emit(currentPage() + 1)"
      >
        <span class="material-symbols-rounded">chevron_right</span>
      </button>
    </div>
  `,
  styles: `
    :host { display: block; }
    .paginator {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
    }
    .pag-label {
      color: #B0B0B0;
      font-family: Roboto, sans-serif;
      font-size: 12px;
    }
    .pag-select {
      display: flex;
      align-items: center;
      gap: 4px;
      background: #1E1E1E;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
    }
    .pag-select-text {
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 12px;
    }
    .pag-arrow {
      color: #B0B0B0;
      font-size: 16px;
    }
    .pag-info {
      color: #B0B0B0;
      font-family: Roboto, sans-serif;
      font-size: 12px;
    }
    .pag-btn {
      width: 32px;
      height: 32px;
      border-radius: 16px;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pag-btn:disabled {
      opacity: 0.38;
      cursor: default;
    }
    .pag-btn .material-symbols-rounded {
      color: #B0B0B0;
      font-size: 20px;
    }
    .pag-btn:not(:disabled):hover {
      background: #2C2C2C;
    }
  `,
})
export class PaginatorComponent {
  totalItems = input<number>(0);
  pageSize = input<number>(20);
  currentPage = input<number>(1);

  pageChanged = output<number>();
  pageSizeChanged = output<number>();

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()) || 1);

  rangeLabel = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    const end = Math.min(this.currentPage() * this.pageSize(), this.totalItems());
    return `${start} – ${end} of ${this.totalItems().toLocaleString()}`;
  });

  cyclePagSize(): void {
    const sizes = [10, 20, 50, 100];
    const idx = sizes.indexOf(this.pageSize());
    const next = sizes[(idx + 1) % sizes.length];
    this.pageSizeChanged.emit(next);
  }
}
