import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Paths } from '../../constants';
import { UserPaymentHistory } from '../../models/payments/user-payment-history.model';
import { HttpClient } from '@angular/common/http';
import { UserPaymentMethodService } from './user-payment-method.service';
import { UserPaymentMethod } from '../../models/payments/user-payment-method.model';
import { ToastrService } from 'ngx-toastr';
import { ChangeDateFormatToDate, CheckIfOneMonthDifference, GetFirstDayOfNextMonth } from '../../utils/date-format';
import { Observable, Subject } from 'rxjs';
import { MonthYearService } from '../month-year.service';
import { UserAccountBalance } from '../../models/payments/user-account-balance.model';
import { Payment } from '../../models/payments/payment.model';
import { PaymentService } from './payment.service';

@Injectable({
  providedIn: 'root'
})
export class UserPaymentHistoryService extends MonthYearService {

  url : string = environment.apiBaseUrl + "/" + Paths.USER_PAYMENT_HISTORY
  userPaymentHistories : UserPaymentHistory[] = []
  balances : UserAccountBalance[] = [];

  constructor(
    public upmService: UserPaymentMethodService,
    private http: HttpClient,
    private toastr: ToastrService
  ) { 
    super(); 
  }

  refreshList() : Observable<boolean> {   
    const subject = new Subject<boolean>();

    this.http.get(this.url).subscribe({
      next: res => { 
        this.userPaymentHistories = res as UserPaymentHistory[];
        console.log("user-payment-history-service", this.userPaymentHistories);
        subject.next(true);
        subject.complete();
      },
      error: err => { 
        console.log('Error during geting UserPaymentHistory', err);
        subject.next(false);
        subject.complete();
      }
    })

    return subject.asObservable();
  }

  postUserPaymentHistoryHttp(upmId: number, date: string, enteredByUser: boolean) {
    const upm = this.upmService.getUserPaymentMethodById(upmId);

    var userPaymentHistory = new UserPaymentHistory({
      userPaymentMethodId: upmId,
      sum: upm?.sum ?? "",
      date: date,
      enteredByUser: enteredByUser
    });

    const { userPaymentMethod, ...userPaymentHistoryWithoutUpm } = userPaymentHistory;
    console.log("userPaymentHistoryWithoutUpm", userPaymentHistoryWithoutUpm)
    return this.http.post(this.url, userPaymentHistoryWithoutUpm);
  }

  postUserPaymentHistory(upm: UserPaymentMethod, date: string, enteredByUser: boolean) {
    upm.id = this.upmService.getUserPaymentMethodId(upm);

    this.postUserPaymentHistoryHttp(upm.id, date, enteredByUser).subscribe({
      next: res => {
        this.userPaymentHistories = res as UserPaymentHistory[]    // list update
        this.toastr.success('Dodano informację o koncie płatnościowym: ' + upm.paymentMethodName, 'Historia konta');
      },
      error: err => { 
        if (err.status == 400)
          this.toastr.error(err.error.message, "Nie dodano informacji o koncie płatnościowym")
        else
          console.log('Error during adding new user payment history: ', err);
      }
    });
  }

  putUserPaymentHistory(userPaymentHistory: UserPaymentHistory) {
    this.http.put(this.url + "/" + userPaymentHistory.id, userPaymentHistory).subscribe({
      next: res => {
        this.userPaymentHistories = res as UserPaymentHistory[]    // list update
        this.toastr.success('Zaktualizowano informację o koncie płatnościowym: ' + userPaymentHistory.userPaymentMethod?.paymentMethodName, 'Historia konta');
      },
      error: err => { 
        if (err.status == 400)
          this.toastr.error(err.error.message, "Nie dodano informacji o koncie płatnościowym")
        else
          console.log('Error during updating user payment history: ', err);
      }
    });
  }

  deleteUserPaymentHistory(id: number) {
    return this.http.delete(this.url + "/" + id)
  }

  includePayment(date: string, userPaymentMethodId : number | null, sum : number | null, isOutcome: boolean) {
    var uph = this.userPaymentHistories.find(uph => 
      uph.date == GetFirstDayOfNextMonth(ChangeDateFormatToDate(date)) && 
      uph.userPaymentMethodId == userPaymentMethodId
    )!

    console.log("Date", date)
    console.log("userPaymentMethodId", userPaymentMethodId)
    console.log("sum", sum)
    console.log("isOutcome", isOutcome)
    console.log("uph", uph)

    if (uph != null) {
      uph.sum = uph.sum + (sum ?? 0) * (isOutcome ? -1 : 1);
      this.putUserPaymentHistory(uph);
      return;
    }

    const upm = this.upmService.getUserPaymentMethodById(userPaymentMethodId);
    if (upm != null)
    {
      const date2 = GetFirstDayOfNextMonth(ChangeDateFormatToDate(date));
      this.postUserPaymentHistoryHttp(upm.id, date2, false).subscribe({
        next: res => {
          this.userPaymentHistories = res as UserPaymentHistory[]    // list update
          this.toastr.success('Dodano informację o koncie płatnościowym: ' + upm.paymentMethodName, 'Historia konta');

          uph = this.userPaymentHistories.find(uph => 
            uph.date == date2 && 
            uph.userPaymentMethodId == userPaymentMethodId
          )!
          console.log("uph2", uph)
      
          uph.sum = uph.sum + (sum ?? 0) * (isOutcome ? -1 : 1);
          this.putUserPaymentHistory(uph);
        },
        error: err => { 
          if (err.status == 400)
            this.toastr.error(err.error.message, "Nie dodano informacji o koncie płatnościowym")
          else
            console.log('Error during adding new user payment history: ', err);
        }
      });
    }
  }
  
  override getYearMonths(dates: string[] | null = null) : Record<string, string[]> {
    return super.getYearMonths(this.userPaymentHistories.map(uph => uph.date));
  }

  override getInfo(list: any[]) {
    super.getInfo(list);

    this.balances = [];
    this.userPaymentHistories.forEach(uph1 => {
      const d1 = ChangeDateFormatToDate(uph1.date)!;

      const uph2 = this.userPaymentHistories.find(uph => 
        uph.userPaymentMethodId == uph1.userPaymentMethodId &&
        d1 >= this.startDate! && 
        ChangeDateFormatToDate(uph.date)! <= this.endDate! && 
        CheckIfOneMonthDifference(d1, ChangeDateFormatToDate(uph.date)!)
      );
      if (uph2 != null) {
        this.balances.push(new UserAccountBalance({
          paymentMethodName: uph1.userPaymentMethod?.paymentMethodName,
          startSum: Number(uph1.sum),
          endSum: Number(uph2.sum),
          balance: Number(uph2.sum) - Number(uph1.sum),
          payments: PaymentService.getPaymentsByDateRangeAndPaymentMethod(list as Payment[], this.startDate, this.endDate, uph1.userPaymentMethodId!)
        }));
      }
    });
  }
}
