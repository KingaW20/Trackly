import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';

import { GetCurrentMonthYearString } from '../../shared/utils/date-format';
import { MonthYearComponent } from '../../shared/components/month-year/month-year.component';
import { UserPaymentHistoryService } from '../../shared/services/payments/user-payment-history.service';
import { UserPaymentMethodService } from '../../shared/services/payments/user-payment-method.service';
import { PaymentService } from '../../shared/services/payments/payment.service';
import { AccountHistoryComponent } from '../account-history/account-history.component';
import { Values } from '../../shared/constants';
import { PaymentsTableComponent } from '../payments-table/payments-table.component';


@Component({
  selector: 'app-user-payment-history',
  standalone: true,
  imports: [ 
    CommonModule, MonthYearComponent, AccountHistoryComponent, PaymentsTableComponent
  ],
  templateUrl: './user-payment-history.component.html',
  styleUrl: './user-payment-history.component.css'
})
export class UserPaymentHistoryComponent {

  ready = false;
  choosedAccountName = "";
  Values = Values;

  constructor(
    public uphService: UserPaymentHistoryService,
    public upmService: UserPaymentMethodService,
    public pService: PaymentService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.upmService.refreshList().subscribe({
      next: (res) => {
        this.uphService.refreshList().subscribe({
          next: (res2) => {
            this.pService.refreshList().subscribe({
              next: (res3) => {
                this.uphService.monthYear = GetCurrentMonthYearString();
                this.uphService.getInfo(this.pService.allPayments);
                this.ready=true;
              }
            });
          }
        });
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 500);
      }
    });
  }

  chooseAccount(accountName: string) {
    if (this.choosedAccountName == accountName)
      this.choosedAccountName = "";
    else
      this.choosedAccountName = accountName;
  }
}