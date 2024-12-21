import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../../environments/environment';
import { Paths } from '../../constants';
import { PaymentMethod } from '../../models/payments/payment-method.model';
import { PaymentMethodComponent } from '../../../payments/payment-method/payment-method.component';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  url : string = environment.apiBaseUrl + "/" + Paths.PAYMENT_METHOD
  paymentMethods : PaymentMethod[] = []

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  refreshList() {
    this.http.get(this.url).subscribe({
      next: res => { this.paymentMethods = res as PaymentMethod[]; },
      error: err => { console.log(err) }
    })
  }

  getPaymentMethodById(id: number | null) {
    const met = this.paymentMethods.find( method => method.id == id );
    return met ? met.name : '';
  }

  postPaymentMethod(paymentMethodName: string) {
    return this.http.post(this.url, { name : paymentMethodName } )
  }

  putPaymentMethod(paymentMethod: PaymentMethod) {
    return this.http.put(this.url + "/" + paymentMethod.id, paymentMethod)
  }

  deletePaymentMethod(id: number) {
    return this.http.delete(this.url + "/" + id)
  }

  onAddNewMethod() {
    this.dialog
      .open(PaymentMethodComponent)
      .afterClosed().subscribe( (result: { name: string } | undefined) => {
        if (result && result!.name) {
          this.postPaymentMethod(result.name).subscribe({
            next: res => {
              this.paymentMethods = res as PaymentMethod[]    // list update
              this.toastr.success('Dodano nową metodę płatności: ' + result.name, 'Nowa metoda płatności');
            },
            error: err => {
              if (err.status == 400)
                this.toastr.error(err.error.message, "Nie dodano nowej metody płatności")
              else
                console.log('Error during adding new payment method:\n', err)}
          })
        }
      });
  }

  onEditMethod(met : PaymentMethod) : void {
    this.dialog
      .open(PaymentMethodComponent, {
        data: { methodName: met.name }
      })
      .afterClosed().subscribe( (result: { name: string } | undefined) => {
        if (result && result!.name) {
          let newMethod = Object.assign({}, met)
          newMethod.name = result.name
          this.putPaymentMethod(newMethod).subscribe({
            next: res => {
              this.paymentMethods = res as PaymentMethod[]    // list update
              this.toastr.success('Pomyślnie zmodyfikowano metodę', 'Metoda płatności');
            },
            error: err => {
              if (err.status == 400)
                this.toastr.error(err.error.message, "Nie zmodyfikowano metody płatności")
              else
                console.log('Error during putting payment method:\n', err)}
          })
        }
    })
  }

  onDeleteMethod(met : PaymentMethod) : void {
    //TODO: delete also payments with this methods if user is ok with that
    if (met.isPaymentWithMethodExists)
      this.toastr.error("Nie można usunąć metody płatności, ponieważ niektóre płatności jej dotyczą", "Nie usunięto płatności")
    else if (confirm("Czy na pewno chcesz usunąć tę metodę płatności?"))
    {
      this.deletePaymentMethod(met.id).subscribe({
        next: res => {
          this.paymentMethods = res as PaymentMethod[]    // list update
          this.toastr.info('Pomyślnie usunięto', 'Metoda płatności');
        },
        error: err => {
          if (err.status == 400)
            this.toastr.error(err.error.message, "Nie usunięto metody płatności")
          else
            console.log('Error during deleting payment method:\n', err)}
      })
    }
  }
}
