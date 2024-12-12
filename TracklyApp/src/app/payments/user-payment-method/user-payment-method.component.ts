import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PaymentMethodService } from '../../shared/services/payment-method.service';
import { UserPaymentMethod } from '../../shared/models/user-payment-method.model';
import { UserPaymentMethodService } from '../../shared/services/user-payment-method.service';

@Component({
  selector: 'app-user-payment-method',
  standalone: true,
  imports: [ FormsModule, MatFormFieldModule, MatInputModule, CommonModule ],
  templateUrl: './user-payment-method.component.html',
  styles: ``
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
