import { Component, input, output, computed } from '@angular/core';

@Component({
  selector: 'cst-paginator',
  standalone: true,
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
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
