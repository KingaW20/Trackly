import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Paths, Values } from '../../constants';
import { UserPaymentHistory } from '../../models/payments/user-payment-history.model';
import { HttpClient } from '@angular/common/http';
import { UserPaymentMethodService } from './user-payment-method.service';
import { UserPaymentMethod } from '../../models/payments/user-payment-method.model';
import { ToastrService } from 'ngx-toastr';
import { ChangeDateFormatToDate, ChangeDateFormatToString, CheckIfDateBefore, CheckIfOneMonthDifference, GetFirstDayOfMonth, GetFirstDayOfNextMonth, GetFirstDaysOfMonthsBetween } from '../../utils/date-format';
import { forkJoin, lastValueFrom, Observable, Subject, subscribeOn, Subscriber } from 'rxjs';
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
  fullBalance : UserAccountBalance = new UserAccountBalance({})

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
        // console.log("user-payment-history-service", this.userPaymentHistories);
        subject.next(true);
        subject.complete();
      },
      error: err => { 
        console.error('Error during geting UserPaymentHistory', err);
        subject.next(false);
        subject.complete();
      }
    })

    return subject.asObservable();
  }

  getSum(userPaymentMethodId: number) : string {
    // console.log("this.userPaymentHistories", this.userPaymentHistories)
    // console.log("userPaymentMethodId", userPaymentMethodId)
    var allUph = this.userPaymentHistories.filter(uph => uph.userPaymentMethodId == userPaymentMethodId) ?? null;
    if (allUph.length == 0) return '0';

    // console.log("getSum in UPHservice - allUph", allUph);

    return allUph.reduce((latest, current) => {
      const latestDate = new Date(latest.date.split('-').reverse().join('-'));
      const currentDate = new Date(current.date.split('-').reverse().join('-'));
      return currentDate > latestDate ? current : latest;
    })?.sum ?? '0';
  }

  postUserPaymentHistoryHttp(upmId: number, date: string, enteredByUser: boolean, upmSum: string) {
    // const upm = this.upmService.getUserPaymentMethodById(upmId);
    // console.log("postUserPaymentHistoryHttp- userPaymentMethod", upm);

    var userPaymentHistory = new UserPaymentHistory({
      userPaymentMethodId: upmId,
      // sum: upm?.sum ?? "",
      sum: upmSum,
      date: date,
      enteredByUser: enteredByUser
    });

    const { userPaymentMethod, ...userPaymentHistoryWithoutUpm } = userPaymentHistory;
    console.log("userPaymentHistoryWithoutUpm", userPaymentHistoryWithoutUpm)
    return this.http.post(this.url, userPaymentHistoryWithoutUpm);
  }

  postUserPaymentHistory(upm: UserPaymentMethod, date: string, enteredByUser: boolean) {
    upm.id = this.upmService.getUserPaymentMethodId(upm);

    console.log("postUserPaymentHistory", {"upm.id": upm.id, "date": date, "enteredByUser": enteredByUser});
    this.postUserPaymentHistoryHttp(upm.id, date, enteredByUser, upm.sum).subscribe({
      next: res => {
        this.userPaymentHistories = res as UserPaymentHistory[]    // list update
        this.toastr.success('Dodano informację o koncie płatnościowym: ' + upm.paymentMethodName, 'Historia konta');
      },
      error: err => { 
        if (err.status == 400)
          this.toastr.error(err.error.message, "Nie dodano informacji o koncie płatnościowym")
        else
          console.error('Error during adding new user payment history: ', err);
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
        console.error('Error during updating user payment history: ', err);
      }
    });
  }

  deleteUserPaymentHistory(id: number) {
    return this.http.delete(this.url + "/" + id)
  }

  addUphsUntill(dateString: string, userPaymentMethodId : number | null, uphs : UserPaymentHistory[]) {
    if (!uphs.length) return;

    let date = ChangeDateFormatToDate(dateString)!;
    let before = { date : null as Date | null, sum : '0' };
    let after = { date : null as Date | null, sum : '0' };

    for (const uph of uphs) {
      const uphDate = ChangeDateFormatToDate(uph.date)!;
      if (uphDate <= date && (!before.date || before.date < uphDate)) before = { date : uphDate, sum : uph.sum };
      if (date <= uphDate && (!after.date || uphDate < after.date)) after = { date : uphDate, sum : uph.sum };
    }

    console.log("allUphUntill")
    console.log("all", uphs)
    console.log("date", date)
    console.log("before", before)
    console.log("after", after)

    let requests: Observable<Object>[] = [];
    
    if (before.date != null) {
      GetFirstDaysOfMonthsBetween(before.date, date).forEach(d => {
        requests.push(this.postUserPaymentHistoryHttp(userPaymentMethodId!, ChangeDateFormatToString(d), false, before.sum));
      });
    }
    if (after.date != null) {
      GetFirstDaysOfMonthsBetween(date, after.date, false).forEach(d => {
        requests.push(this.postUserPaymentHistoryHttp(userPaymentMethodId!, ChangeDateFormatToString(d), false, after.sum));
      });
    }

    return requests.length > 0 ? forkJoin(requests) : new Observable(Subscriber => Subscriber.complete());
  }

  async includePayment(dateStr: string, userPaymentMethodId : number | null, sum : number | null, isOutcome: boolean) {
    var date = ChangeDateFormatToDate(dateStr);               // 04-03-2025
    var firstDayMonth = GetFirstDayOfMonth(date);             // 01-03-2025
    var firstDayNextMonth = GetFirstDayOfNextMonth(date);     // 01-04-2025

    // wprowadzone (true) 6.01 - 5000         stan konta 1.02 - 5000
    // dodanie płatności 3.01 1125 ->   dodanie uph 1.01 - 6125

    var allUPHforUPM = this.userPaymentHistories.filter(uph => uph.userPaymentMethodId == userPaymentMethodId);
    var createUPHsForDate = "";
    if (!allUPHforUPM?.find(uph => uph.date == firstDayMonth)) {
      console.log("Nie ma poprzedniej daty", firstDayMonth)
      createUPHsForDate = firstDayMonth;
    }
    if (!allUPHforUPM?.find(uph => uph.date == firstDayNextMonth)) {
      console.log("Nie ma następnej daty", firstDayNextMonth);
      createUPHsForDate = firstDayNextMonth;
    }
  
    console.log("condition", createUPHsForDate)
    if (createUPHsForDate) {
      this.addUphsUntill(createUPHsForDate, userPaymentMethodId, allUPHforUPM)?.subscribe({
        next: res => {
          const resArray = res as UserPaymentHistory[][];
          resArray.forEach(uphArray => this.userPaymentHistories = uphArray as UserPaymentHistory[]);
          console.log("uph updated", this.userPaymentHistories);
          this.includePayment(dateStr, userPaymentMethodId, sum, isOutcome);
        },
        error: err => console.error("Error: ", err)
      });
      return;
    }

    // find user payment history entered by user
    //TODO: what if there's many of inputed values???
    var uphUser = allUPHforUPM.filter(uph => uph.enteredByUser);

    var findDate = firstDayNextMonth;
    var revert = false
    // user entered the account info in this month and payment date is before entered info
    if (uphUser.length > 0 && CheckIfDateBefore(dateStr, uphUser[0].date)) {
      findDate = firstDayMonth;
      revert = true;
    } 
    console.log("here", {
      "uph": uphUser[0],
      "findDate": findDate,
      "revert": revert
    })
    console.log("allUPH", this.userPaymentHistories)

    // find user payment history that should be updatesd
    var uphUserToUpdate = this.userPaymentHistories.find(uph => 
      uph.date == findDate && 
      uph.userPaymentMethodId == userPaymentMethodId
    )
    console.log("here2", {
      "uph": uphUserToUpdate,
      "findDate": findDate,
      "revert": revert
    })

    if (uphUserToUpdate != null) {
      uphUserToUpdate.sum = (+uphUserToUpdate.sum + (sum ?? 0) * (isOutcome ? -1 : 1) * (revert ? -1 : 1)).toFixed(2);
      console.log("uphUser to putUserPaymentHistory", uphUserToUpdate)
      this.putUserPaymentHistory(uphUserToUpdate);
      return;
    }

    //TODO: is this necessary???
    // if not found -> add and find
    const upm = this.upmService.getUserPaymentMethodById(userPaymentMethodId);
    console.log("uphService - includePayment - upm", upm)
    if (upm != null)
    {
      console.log("uphService - includePayment - postUserPaymentHistoryHttp", {
        "upm.id": upm.id, "findDate": findDate, "enteredByUser": false
      })
      this.postUserPaymentHistoryHttp(upm.id, findDate, false, upm.sum).subscribe({
        next: res => {
          this.userPaymentHistories = res as UserPaymentHistory[]    // list update
          this.toastr.success('Dodano informację o koncie płatnościowym: ' + upm.paymentMethodName, 'Historia konta');

          uphUserToUpdate = this.userPaymentHistories.find(uph => 
            uph.date == findDate && 
            uph.userPaymentMethodId == userPaymentMethodId
          )!
      
          uphUserToUpdate.sum = uphUserToUpdate.sum + (sum ?? 0) * (isOutcome ? -1 : 1) * (revert ? -1 : 1);
          this.putUserPaymentHistory(uphUserToUpdate);
        },
        error: err => {
          if (err.status == 400)
            this.toastr.error(err.error.message, "Nie dodano informacji o koncie płatnościowym")
          else
            console.error('Error during adding new user payment history: ', err);
        }
      });
    }
  }
  
  override getYearMonths(dates: string[] | null = null) : Record<string, string[]> {
    return super.getYearMonths(this.userPaymentHistories.map(uph => uph.date));
  }

  override getInfo(list: any[]) {
    super.getInfo(list);

    // console.log("startDate", this.startDate)
    // console.log("endDate", this.endDate)

    this.balances = [];
    //TODO: rewrite this to for each account (userPaymentMethod) get all userPaymentHistories i na tej podstawie wykonać odpowiednie operacje
    this.userPaymentHistories.forEach(uph1 => {
      const d1 = ChangeDateFormatToDate(uph1.date)!;

      if (d1.getDate() == 1 && this.startDate! <= d1 && d1 <= this.endDate! && 
        !this.balances.find(b => b.paymentMethodName == uph1.userPaymentMethod?.paymentMethodName))
      {
        const uph2 = this.userPaymentHistories.filter(uph => 
          uph1.id != uph.id &&
          uph.userPaymentMethodId == uph1.userPaymentMethodId &&
          this.startDate! <= ChangeDateFormatToDate(uph.date)! && 
          ChangeDateFormatToDate(uph.date)! <= this.endDate! &&
          ChangeDateFormatToDate(uph.date)?.getDate() == 1
          // && CheckIfOneMonthDifference(d1, ChangeDateFormatToDate(uph.date)!)
        );
        // console.log("upm", uph1.userPaymentMethod?.paymentMethodName);

        if (uph2.length == 1) {
          var uph1IsFirst = ChangeDateFormatToDate(uph1.date)! <= ChangeDateFormatToDate(uph2[0].date)!
          var sum0 = uph1IsFirst ? Number(uph1.sum) : Number(uph2[0].sum);
          var sum1 = uph1IsFirst ? Number(uph2[0].sum) : Number(uph1.sum);
          this.balances.push(new UserAccountBalance({
            paymentMethodName: uph1.userPaymentMethod?.paymentMethodName,
            startSum: sum0,
            endSum: sum1,
            balance: +(sum1 - sum0).toFixed(2),
            payments: PaymentService.getPaymentsByDateRangeAndPaymentMethod(list as Payment[], this.startDate, this.endDate, uph1.userPaymentMethodId!)
          }));
        } else if (uph2.length > 1) {
          // console.log("uph1", uph1);
          // console.log("uph2", uph2);
          uph2.push(uph1);
          const { earliest, latest } = uph2.reduce(
            (res, uph) => {
              const d = ChangeDateFormatToDate(uph.date)!;
              if (!res.earliest || d < ChangeDateFormatToDate(res.earliest.date)!) res.earliest = uph;
              if (!res.latest || d > ChangeDateFormatToDate(res.latest.date)!) res.latest = uph;
              return res;
            }, { earliest: null as UserPaymentHistory | null, latest: null as UserPaymentHistory | null }
          )
          var sum0 = +(earliest?.sum ?? 0);
          var sum1 = +(latest?.sum ?? 0);
          // console.log("earliest", earliest);
          // console.log("latest", latest);

          if (!this.balances.find(b => b.paymentMethodName == uph1.userPaymentMethod?.paymentMethodName)) {
            this.balances.push(new UserAccountBalance({
              paymentMethodName: uph1.userPaymentMethod?.paymentMethodName,
              startSum: sum0,
              endSum: sum1,
              balance: +(sum1 - sum0).toFixed(2),
              payments: PaymentService.getPaymentsByDateRangeAndPaymentMethod(list as Payment[], this.startDate, this.endDate, uph1.userPaymentMethodId!)
            }));
          }
        }
      }
    });

    // console.log("Balances", this.balances);

    var sum1 = +(this.balances.reduce((sum, b) => sum + b.startSum, 0)).toFixed(2);
    var sum2 = +(this.balances.reduce((sum, b) => sum + b.endSum, 0)).toFixed(2);
    this.fullBalance = new UserAccountBalance({
      paymentMethodName: Values.ALL_ACCOUNTS,
      startSum: sum1,
      endSum: sum2,
      balance: +(sum2 - sum1).toFixed(2),
      payments: this.balances.flatMap(b => b.payments)
    });
  }
}
