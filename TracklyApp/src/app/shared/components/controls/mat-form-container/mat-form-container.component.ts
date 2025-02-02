import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatActionsComponent } from '../mat-actions/mat-actions.component';

@Component({
  selector: 'app-mat-form-container',
  standalone: true,
  imports: [ FormsModule, MatActionsComponent ],
  templateUrl: './mat-form-container.component.html',
  styles: ``
})
export class MatFormContainerComponent {
  @Input({ required: true }) title! : string;
  @Input({ required: true }) formSubmitted : boolean = false;

  @Output() cancel = new EventEmitter();
  @Output() submit = new EventEmitter();

  onCancel() {
    this.cancel.emit();
  }

  onSubmit(form: any) {
    this.submit.emit(form);
  }
}
