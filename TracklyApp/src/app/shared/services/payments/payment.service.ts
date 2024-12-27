import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { NgForm } from "@angular/forms";

import { environment } from '../../../../environments/environment';
import { Paths } from '../../constants';
import { Payment } from '../../models/payments/payment.model';
import { Transfer } from '../../models/transfer.model';
import { PaginatableService } from "../paginatable.service";

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

  constructor(private http: HttpClient) {
    super();
  }

  refreshList(){
    // const params = new HttpParams()
    //   .set('page', this.currentPage)
    //   .set('take', this.pageItemNumber)

    this.http.get(this.url).subscribe({
      next: res => {
        this.allPayments = res as Payment[];
        this.changePage(1)
      },
      error: err => { console.log(err) }
    })
  }

  updateAllPayments(payments: Payment[]) {    
    this.allPayments = payments
    this.changePage(this.paginator.currentPage)
  }

  override changePage(newPage: number, listLength?: number) {
    super.changePage(newPage, this.allPayments.length);
    this.currentPayments = this.paginator.getListPart(this.allPayments)
  }

  postPayment() {
    return this.http.post(this.url, this.paymentFormData)
  }

  putPayment() {
    return this.http.put(this.url + "/" + this.paymentFormData.id, this.paymentFormData)
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
