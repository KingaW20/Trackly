import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Payment } from '../../shared/models/payments/payment.model';
import { CommonModule } from '@angular/common';
import { MyTdComponent } from '../../shared/components/controls/my-td/my-td.component';

@Component({
  selector: 'app-payments-table',
  standalone: true,
  imports: [ CommonModule, MyTdComponent ],
  templateUrl: './payments-table.component.html',
  styles: ``
})
export class PaymentsTableComponent {
  @Input() showDetails : boolean = false;
  @Input({ required: true }) payments : Payment[] = [];

  @Output() modifyPayment = new EventEmitter<Payment>();
  @Output() deletePayment = new EventEmitter<number>();

  choosePayment(p: Payment) {
    this.modifyPayment.emit(p);
  }

  onDelete(id: number) {
    this.deletePayment.emit(id);
  }
}
