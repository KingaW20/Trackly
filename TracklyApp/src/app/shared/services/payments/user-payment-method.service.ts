import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { Paths } from '../../constants';
import { UserPaymentMethod } from '../../models/payments/user-payment-method.model';
import { Observable, of, Subject } from 'rxjs';
// import { UserPaymentHistoryService } from './user-payment-history.service';

@Injectable({
  providedIn: 'root'
})
export class UserPaymentMethodService {

  url : string = environment.apiBaseUrl + "/" + Paths.USER_PAYMENT_METHOD
  userPaymentMethods : UserPaymentMethod[] = []
  choosedUpm : UserPaymentMethod = new UserPaymentMethod()
  choosedDate : Date | null = null

  constructor(
    private http: HttpClient,
    // public userPaymentHistoryService : UserPaymentHistoryService
  ) { 
    // userPaymentHistoryService.refreshList();
  }

  refreshList() : Observable<boolean> {   
    const subject = new Subject<boolean>();

    this.http.get(this.url).subscribe({
      next: res => { 
        this.userPaymentMethods = res as UserPaymentMethod[]; 
        // this.userPaymentMethods.forEach(upm => upm.sum = this.userPaymentHistoryService.getSum(upm.id));
        // console.log("user-payment-method-service", this.userPaymentMethods);
        subject.next(true);
        subject.complete();
      },
      error: err => { 
        console.error('Error during geting UserPaymentMethods', err);
        subject.next(false);
        subject.complete();
      }
    })
    
    return subject.asObservable();
  }

  getUserPaymentMethodById(id: number | null) {
    return this.userPaymentMethods.find( method => method.id == id ) ?? null;
  }

  getUserPaymentMethodId(userPaymentMethod: UserPaymentMethod) {
    return this.userPaymentMethods.find(upm => 
        upm.paymentMethodId == userPaymentMethod.paymentMethodId && 
        upm.paymentMethodName == userPaymentMethod.paymentMethodName &&
        upm.sum == userPaymentMethod.sum
      )?.id ?? 0
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
