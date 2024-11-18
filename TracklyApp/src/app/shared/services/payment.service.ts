import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NgForm } from "@angular/forms";
import { environment } from '../../../environments/environment';
import { Payment } from '../payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  url: string = environment.apiBaseUrl + "/Payment"
  list: Payment[] = []
  formData: Payment = new Payment()
  formSubmitted:boolean = false;

  constructor(private http: HttpClient) { }

  refreshList(){
    this.http.get(this.url).subscribe({
      next: res => {
        this.list = res as Payment[];
      },
      error: err => { console.log(err) }
    })
  }

  postPayment() {
    return this.http.post(this.url, this.formData)
  }

  putPayment() {
    return this.http.put(this.url + "/" + this.formData.paymentId, this.formData)
  }

  deletePayment(id: number) {
    return this.http.delete(this.url + "/" + id)
  }

  resetForm(form: NgForm) {
    form.form.reset();
    this.formData = new Payment()
    this.formSubmitted = false
  }
}