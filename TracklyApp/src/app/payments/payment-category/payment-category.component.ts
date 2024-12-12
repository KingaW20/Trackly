import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-payment-category',
  standalone: true,
  imports: [ MatFormFieldModule, MatInputModule, FormsModule ],
  templateUrl: './payment-category.component.html',
  styles: ``
})
export class PaymentCategoryComponent {
  public categoryName: string = '';
  formSubmitted: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<PaymentCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {categoryName?: string}
  ) {
    if (data?.categoryName)
      this.categoryName = data.categoryName;
  }  

  onNoClick(): void {
    this.categoryName = "";
    this.closeDialog();
  }

  onSubmit(form: NgForm) {
    this.formSubmitted = true
    if(form.valid)
      this.closeDialog();
  }

  closeDialog(): void {
    this.dialogRef.close( { name: this.categoryName } );
  }
}
