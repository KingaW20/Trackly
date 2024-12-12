import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PaymentMethodService } from '../../../shared/services/payment-method.service';
import { Values } from '../../../shared/constants';

@Component({
  selector: 'app-manage-payment-methods',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './manage-payment-methods.component.html',
  styles: ``
})
export class ManagePaymentMethodsComponent {

  Math = Math
  Values = Values

  constructor(
    public paymentMethodService : PaymentMethodService
  ) { }

  ngOnInit(): void {
    this.paymentMethodService.refreshList();
  }
}
