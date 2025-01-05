import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { NgForm } from "@angular/forms";

import { environment } from '../../../../environments/environment';
import { Paths, Values } from '../../constants';
import { Payment } from '../../models/payments/payment.model';
import { Transfer } from '../../models/transfer.model';
import { PaginatableService } from "../paginatable.service";
import { UserPaymentMethod } from "../../models/payments/user-payment-method.model";
import { ChangeDateFormatToDate, ChangeDateFormatToString } from "../../utils/date-format";
import { PaymentCategoryService } from "./payment-category.service";
import { ToastrService } from "ngx-toastr";
import { UserPaymentMethodService } from "./user-payment-method.service";
import { UserPaymentHistoryService } from "./user-payment-history.service";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends PaginatableService {

  url : string = environment.apiBaseUrl + "/" + Paths.PAYMENT
  allPayments : Payment[] = []
  currentPayments : Payment[] = []

  paymentFormData : Payment = new Payment({})
  dateForm : Date | null = null
  formSubmitted : boolean = false
  paymentFormShown : boolean = false

  transferFormData : Transfer = new Transfer()
  transferFormShown : boolean = false

  constructor(
    public categoryService: PaymentCategoryService,
    public userPaymentMethodService: UserPaymentMethodService,
    public userPaymentHistoryService: UserPaymentHistoryService,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    super();
  }

  refreshList() : Observable<boolean> {   
    const subject = new Subject<boolean>();
    // const params = new HttpParams()
    //   .set('page', this.currentPage)
    //   .set('take', this.pageItemNumber)

    this.http.get(this.url).subscribe({
      next: res => {
        this.allPayments = res as Payment[];
        this.changePage(1)
        subject.next(true);
        subject.complete();
      },
      error: err => { 
        console.log(err)
        subject.next(false);
        subject.complete();
      }
    })

    return subject.asObservable();
  }

  getPaymentById(id: number) : Payment | null {
    return this.allPayments.find(p => p.id == id) ?? null;
  }

  static getPaymentsByDateRangeAndPaymentMethod(list: Payment[], startDate: Date | null, endDate: Date | null, userPaymentMethodId: number) : Payment[] {  
    if (startDate != null && endDate != null) {
      return list.filter(p => 
        p.userPaymentMethodId == userPaymentMethodId &&
        p.date != "" && ChangeDateFormatToDate(p.date)! >= startDate! && ChangeDateFormatToDate(p.date)! < endDate!
      );
    }
  
    return [];
  }

  updateAllPayments(payments: Payment[]) {    
    this.allPayments = payments
    this.changePage(this.paginator.currentPage)
  }

  override changePage(newPage: number, listLength?: number) {
    super.changePage(newPage, this.allPayments.length);
    this.currentPayments = this.paginator.getListPart(this.allPayments)
  }

  postPayment(payment: Payment) {
    const p = payment;
    this.http.post(this.url, payment).subscribe({
      next: res => {
        this.updateAllPayments(res as Payment[])    // list update
        this.toastr.success('Dodano pomyślnie', 'Płatność');
        this.userPaymentMethodService.refreshList();
        this.userPaymentHistoryService.includePayment(p.date, p.userPaymentMethodId, p.sum, p.isOutcome);
      },
      error: err => { console.log(err) }
    })
  }

  putPayment(payment: Payment) {
    return this.http.put(this.url + "/" + payment.id, payment)
  }

  addRepairPayment(upmBefore: UserPaymentMethod, upmAfter: UserPaymentMethod) {
    var cat = this.categoryService.getCategoryByName(Values.INCORRECTNESS);

    var payment = new Payment({
      categoryId: cat?.id,
      userPaymentMethodId: upmAfter.id,
      description: "Aktualizacja stanu konta",
      sum: Math.abs(Number(upmAfter.sum) - Number(upmBefore.sum)),
      date: ChangeDateFormatToString(new Date()),
      isOutcome: Number(upmAfter.sum) < Number(upmBefore.sum),
      paymentCategoryName: cat?.name,
      paymentMethodName: upmAfter.paymentMethodName
    })

    this.postPayment(payment);
  }

  deletePayment(id: number) {
    return this.http.delete(this.url + "/" + id)
  }

  resetForm(form?: NgForm) {
    if (form) form.form.reset();
    this.paymentFormData = new Payment({})
    this.transferFormData = new Transfer()
    this.formSubmitted = false
  }
}
