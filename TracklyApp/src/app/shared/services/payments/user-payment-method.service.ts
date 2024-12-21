import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { Paths } from '../../constants';
import { UserPaymentMethod } from '../../models/payments/user-payment-method.model';

@Injectable({
  providedIn: 'root'
})
export class UserPaymentMethodService {

  url : string = environment.apiBaseUrl + "/" + Paths.USER_PAYMENT_METHOD
  userPaymentMethods : UserPaymentMethod[] = []
  choosedUpm : UserPaymentMethod = new UserPaymentMethod()

  constructor(private http: HttpClient) { }

  refreshList() {
    this.http.get(this.url).subscribe({
      next: res => { this.userPaymentMethods = res as UserPaymentMethod[]; },
      error: err => { console.log('Error during geting UserPaymentMethods', err) }
    })
  }

  getUserPaymentMethodById(id: number | null) {
    const met = this.userPaymentMethods.find( method => method.id == id );
    return met ? met.paymentMethodName : '';
  }

  postUserPaymentMethod(userPaymentMethod: UserPaymentMethod) {
    return this.http.post(this.url, userPaymentMethod)
  }

  putUserPaymentMethod(userPaymentMethod: UserPaymentMethod) {
    return this.http.put(this.url + "/" + userPaymentMethod.id, userPaymentMethod)
  }

  deleteUserPaymentMethod(id: number) {
    return this.http.delete(this.url + "/" + id)
  }
}
