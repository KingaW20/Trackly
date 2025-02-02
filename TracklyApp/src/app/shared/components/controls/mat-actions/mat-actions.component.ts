import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'div[mat-dialog-actions]',
  standalone: true,
  imports: [],
  templateUrl: './mat-actions.component.html',
  styles: ``,
  host: {
    class: "dialog-actions"
  }
})
export class MatActionsComponent {
  @Output() cancel = new EventEmitter();

  onNoClick() {
    this.cancel.emit();
  }
}
