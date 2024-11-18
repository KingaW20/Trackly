import { Component } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { PaymentService } from '../../shared/services/payment.service';
import { Payment } from '../../shared/payment.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './payment-form.component.html',
  styles: ``
})
export class PaymentFormComponent {

  constructor(public service : PaymentService, private toastr: ToastrService) { }

  onSubmit(form: NgForm) {
    this.service.formSubmitted = true
    if(form.valid)
    {
      if (this.service.formData.paymentId == 0)
        this.insertRecord(form)
      else
        this.updateRecord(form)
    }
  }

  insertRecord(form: NgForm) {
    this.service.postPayment().subscribe({
      next: res => {
        this.service.list = res as Payment[]    // list update
        this.service.resetForm(form)
        this.toastr.success('Dodano pomyślnie', 'Płatność');
      },
      error: err => { console.log(err) }
    })
  }
  
  updateRecord(form: NgForm) {
    this.service.putPayment().subscribe({
      next: res => {
        this.service.list = res as Payment[]    // list update
        this.service.resetForm(form)
        this.toastr.info('Zmodyfikowano pomyślnie', 'Płatność');
      },
      error: err => { console.log(err) }
    })
  }
}
