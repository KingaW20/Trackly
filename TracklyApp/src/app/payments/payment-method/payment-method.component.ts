import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [ MatFormFieldModule, MatInputModule, FormsModule ],
  templateUrl: './payment-method.component.html',
  styles: ``
})
export class PaymentMethodComponent {
  public methodName: string = '';
  formSubmitted: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<PaymentMethodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {methodName?: string}
  ) {
    if (data?.methodName)
      this.methodName = data.methodName;
  }  

  onNoClick(): void {
    this.methodName = "";
    this.closeDialog();
  }

  onSubmit(form: NgForm) {
    this.formSubmitted = true
    if(form.valid)
      this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close( { name: this.methodName } );
  }
}
