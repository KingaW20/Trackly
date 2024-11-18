import { Component, OnInit } from '@angular/core';
import { NgFor } from "@angular/common";
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { PaymentService } from '../shared/services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { Payment } from '../shared/models/payment.model';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [PaymentFormComponent, NgFor],
  templateUrl: './payments.component.html',
  styles: []
})
export class PaymentsComponent implements OnInit {

  constructor(public service : PaymentService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.service.refreshList();
  }

  populateForm(selectedRecord: Payment) {
    this.service.formData = Object.assign({}, selectedRecord)
  }

  onDelete(id: number) {
    if (confirm("Czy na pewno chcesz usunąć tę płatność?"))
    {
      this.service.deletePayment(id).subscribe({
        next: res => {
          this.service.list = res as Payment[]    // list update
          this.toastr.error('Usunięto pomyślnie', 'Płatność');
        },
        error: err => { console.log(err) }
      })
    }
  }
}
