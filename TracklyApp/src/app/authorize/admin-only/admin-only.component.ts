import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ManagePaymentCategoriesComponent } from './manage-payment-categories/manage-payment-categories.component';
import { ManagePaymentMethodsComponent } from './manage-payment-methods/manage-payment-methods.component';
import { Values } from '../../shared/constants';

@Component({
  selector: 'app-admin-only',
  standalone: true,
  imports: [ CommonModule, ManagePaymentCategoriesComponent, ManagePaymentMethodsComponent ],
  templateUrl: './admin-only.component.html',
  styles: ``
})
export class AdminOnlyComponent {

  Values = Values

  show : { [key: string]: boolean } = {
    managePaymentCategories : false,
    managePaymentMethods : false
  }

  constructor() {}

  open(toOpen: string): void {
    this.show[toOpen] = !this.show[toOpen];

    Object.keys(this.show).forEach(key => {
      if (toOpen != key)
        this.show[key] = false;
    })
  }
}
