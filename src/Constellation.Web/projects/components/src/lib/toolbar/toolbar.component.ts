import { Component, output } from '@angular/core';

@Component({
  selector: 'cst-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  menuToggled = output<void>();
}
