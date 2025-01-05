import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ChangeDateFormatToDate, GetFirstDayOfMonth, GetFirstDayOfNextMonth } from '../shared/utils/date-format';
import { Payment } from '../shared/models/payments/payment.model';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { PaymentService } from '../shared/services/payments/payment.service';
import { TransferFormComponent } from './transfer-form/transfer-form.component';
import { UserPaymentAccountsComponent } from './user-payment-accounts/user-payment-accounts.component';
import { Paths } from '../shared/constants';
import { MatDialog } from '@angular/material/dialog';
import { UserPaymentMethodComponent } from './user-payment-method/user-payment-method.component';
import { UserPaymentMethodService } from '../shared/services/payments/user-payment-method.service';
import { UserPaymentHistoryService } from '../shared/services/payments/user-payment-history.service';
import { UserPaymentMethod } from '../shared/models/payments/user-payment-method.model';
import { PaymentCategoryService } from '../shared/services/payments/payment-category.service';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    CommonModule, PaginationComponent,
    PaymentFormComponent, TransferFormComponent, UserPaymentAccountsComponent 
  ],
  templateUrl: './payments.component.html',
  styles: []
})
export class PaymentsComponent implements OnInit {

  dialogRef : any = null
  paths = Paths

  constructor(
    public service : PaymentService, 
    public categoryService : PaymentCategoryService,
    public userPaymentMethodService: UserPaymentMethodService, 
    public userPaymentHistoryService: UserPaymentHistoryService,
    private router: Router, 
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.service.refreshList();
    this.categoryService.refreshList();
  }

  populateForm(selectedRecord: Payment) {
    if (!this.service.paymentFormShown)
      this.showPaymentForm();
      
    this.service.paymentFormData = new Payment(Object.assign({}, selectedRecord))
    this.service.dateForm = ChangeDateFormatToDate(this.service.paymentFormData.date)
  }

  onDelete(id: number) {
    if (confirm("Czy na pewno chcesz usunąć tę płatność?"))
    {
      const p = this.service.getPaymentById(id);

      this.service.deletePayment(id).subscribe({
        next: res => {
          this.service.updateAllPayments(res as Payment[])    // list update
          this.toastr.info('Usunięto pomyślnie', 'Płatność');
          this.userPaymentHistoryService.includePayment(
            p?.date ?? "", p?.userPaymentMethodId ?? null, p?.sum ?? null, !(p?.isOutcome ?? true));
          this.userPaymentMethodService.refreshList();
        },
        error: err => { console.log(err) }
      })
    }
  }

  // todo: Ujednolicić: Ta sama funkcja jest w payment-form.component.ts
  onAddNewUserPaymentMethod() {
    this.dialogRef = this.dialog.open(UserPaymentMethodComponent);

    this.dialogRef.afterClosed().subscribe( () => {
      const result = this.userPaymentMethodService.choosedUpm;
      const choosedDate = this.userPaymentMethodService.choosedDate;
      if (result.paymentMethodName != "") {
        this.userPaymentMethodService.postUserPaymentMethod(result).subscribe({
          next: res => {
            this.userPaymentMethodService.userPaymentMethods = res as UserPaymentMethod[]    // list update

            const date = GetFirstDayOfMonth(choosedDate);
            this.userPaymentHistoryService.postUserPaymentHistory(result, date, true);
            
            const date2 = GetFirstDayOfNextMonth(choosedDate);
            this.userPaymentHistoryService.postUserPaymentHistory(result, date2, false);

            this.toastr.success('Dodano nowe konto płatnościowe: ' + result.paymentMethodName, 'Metoda płatności');
          },
          error: err => { 
            if (err.status == 400)
              this.toastr.error(err.error.message, "Nie dodano nowego konta płatnościowego")
            else
              console.log('Error during adding new user payment method: ', err);
          }
        })
      }
      this.userPaymentMethodService.choosedUpm = new UserPaymentMethod()
      this.userPaymentMethodService.choosedDate = null;
    });
  }

  showPaymentForm(){
    this.service.paymentFormShown = !this.service.paymentFormShown;
    this.service.transferFormShown = false;
  }

  showTransferForm(){
    this.service.transferFormShown = !this.service.transferFormShown;
    this.service.paymentFormShown = false;
  }

  showUserPaymentHistory() {    
    this.router.navigateByUrl(Paths.USER_PAYMENT_HISTORY)
  }
}
