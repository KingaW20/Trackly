import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { ChangeDateFormatToDate } from '../shared/utils/date-format';
import { Payment } from '../shared/models/payment.model';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { PaymentService } from '../shared/services/payment.service';
import { TransferFormComponent } from './transfer-form/transfer-form.component';
import { UserPaymentAccountsComponent } from './user-payment-accounts/user-payment-accounts.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [PaymentFormComponent, TransferFormComponent, CommonModule, UserPaymentAccountsComponent],
  templateUrl: './payments.component.html',
  styles: []
})
export class PaymentsComponent implements OnInit {

  dialogRef : any = null

  constructor(
    public service : PaymentService, 
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.service.refreshList();
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
      this.service.deletePayment(id).subscribe({
        next: res => {
          this.service.updateAllPayments(res as Payment[])    // list update
          this.toastr.info('Usunięto pomyślnie', 'Płatność');
        },
        error: err => { console.log(err) }
      })
    }
  }

  showPaymentForm(){
    this.service.paymentFormShown = !this.service.paymentFormShown;
    this.service.transferFormShown = false;
  }

  showTransferForm(){
    this.service.transferFormShown = !this.service.transferFormShown;
    this.service.paymentFormShown = false;
  }
}
