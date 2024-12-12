import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PaymentCategoryService } from '../../../shared/services/payment-category.service';
import { Values } from '../../../shared/constants';

@Component({
  selector: 'app-manage-payment-categories',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './manage-payment-categories.component.html',
  styles: ``
})
export class ManagePaymentCategoriesComponent {

  Math = Math
  Values = Values

  constructor(
    public paymentCategoryService : PaymentCategoryService
  ) { }

  ngOnInit(): void {
    this.paymentCategoryService.refreshList();
  }
}
