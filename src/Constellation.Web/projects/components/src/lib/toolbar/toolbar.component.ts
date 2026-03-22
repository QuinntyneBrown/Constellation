import { Component, output } from '@angular/core';

@Component({
  selector: 'cst-toolbar',
  standalone: true,
  template: `
    <header class="toolbar">
      <button class="icon-btn" (click)="menuToggled.emit()">
        <span class="material-symbols-rounded">menu</span>
      </button>
      <span class="toolbar-title">Constellation</span>
      <span class="spacer"></span>
      <button class="icon-btn">
        <span class="material-symbols-rounded">search</span>
      </button>
      <button class="icon-btn">
        <span class="material-symbols-rounded">notifications</span>
      </button>
      <div class="avatar-circle">
        <span class="avatar-text">QA</span>
      </div>
    </header>
  `,
  styles: `
    :host { display: block; }
    .toolbar {
      background: #1F1F1F;
      height: 64px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 1px solid #333333;
      box-sizing: border-box;
    }
    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
    }
    .icon-btn .material-symbols-rounded {
      color: #B0B0B0;
      font-size: 24px;
    }
    .toolbar-title {
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 20px;
      font-weight: 500;
    }
    .spacer {
      flex: 1;
    }
    .avatar-circle {
      width: 36px;
      height: 36px;
      border-radius: 18px;
      background: #BB86FC;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar-text {
      color: #FFFFFF;
      font-family: Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
    }
  `,
})
export class ToolbarComponent {
  menuToggled = output<void>();
}
