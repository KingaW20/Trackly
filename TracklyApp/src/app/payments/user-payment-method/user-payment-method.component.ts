import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PaymentMethodService } from '../../shared/services/payments/payment-method.service';
import { UserPaymentMethod } from '../../shared/models/payments/user-payment-method.model';
import { UserPaymentMethodService } from '../../shared/services/payments/user-payment-method.service';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-user-payment-method',
  standalone: true,
  imports: [ FormsModule, MatFormFieldModule, MatInputModule, CommonModule, MatDatepickerModule ],
  templateUrl: './user-payment-method.component.html',
  styles: ``,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    provideNativeDateAdapter()
  ]
})
export class UserPaymentMethodComponent {

  formSubmitted: boolean = false;

  constructor(
    public paymentMethodService: PaymentMethodService, 
    public upmService: UserPaymentMethodService,
    private upmDialogRef: MatDialogRef<UserPaymentMethodComponent>
  ) { }  

  ngOnInit(): void {
    this.paymentMethodService.refreshList();
  }

  trackById(index: number, item: any): any {
    return item.id;
  }

  onNoClick(): void {
    this.upmService.choosedUpm = new UserPaymentMethod();
    this.upmDialogRef.close();
  }

  onSubmit(form: NgForm) {
    this.formSubmitted = true
    if(form.valid)
      this.upmDialogRef.close();
  }

  onPaymentMethodChange(): void {
    this.upmService.choosedUpm.paymentMethodName = 
      this.paymentMethodService.getPaymentMethodById(this.upmService.choosedUpm.paymentMethodId);
  }
}
