import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { UserPaymentMethod } from '../../shared/models/payments/user-payment-method.model';
import { UserPaymentMethodComponent } from '../user-payment-method/user-payment-method.component';
import { UserPaymentMethodService } from '../../shared/services/payments/user-payment-method.service';
import { UserPaymentHistoryService } from '../../shared/services/payments/user-payment-history.service';
import { PaymentService } from '../../shared/services/payments/payment.service';

@Component({
  selector: 'app-user-payment-accounts',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './user-payment-accounts.component.html',
  styleUrl: './user-payment-accounts.component.css'
})
export class UserPaymentAccountsComponent {
  dialogRef : any = null
  isMouseHover : boolean = false

  constructor( 
    public upmService : UserPaymentMethodService, 
    public paymentService : PaymentService,
    public userPaymentHistoryService : UserPaymentHistoryService,
    private toastr : ToastrService,
    private dialog : MatDialog
  ) { }

  ngOnInit(): void {
    this.upmService.refreshList();
    this.userPaymentHistoryService.refreshList();
  }

  onDelete(upm: UserPaymentMethod) : void {
    if (confirm("Czy na pewno chcesz usunąć konto " + upm.paymentMethodName + "?"))
    {
      this.upmService.deleteUserPaymentMethod(upm.id).subscribe({
        next: res => {
          this.upmService.userPaymentMethods = res as UserPaymentMethod[]    // list update
          this.toastr.info('Usunięto pomyślnie', 'Konto płatnościowe');
          this.paymentService.refreshList();
        },
        error: err => { console.error(err) }
      })
    }
  }

  onEdit(upm: UserPaymentMethod) : void {
    this.upmService.choosedUpm = Object.assign({}, upm)
    this.upmService.choosedDate = new Date();
    this.dialogRef = this.dialog.open(UserPaymentMethodComponent)
    const upmBeforeChange = this.upmService.getUserPaymentMethodById(upm.id)!;

    this.dialogRef.afterClosed().subscribe( () => {
      var result = this.upmService.choosedUpm
      this.paymentService.addRepairPayment(upmBeforeChange, result);
      // if (result.id != 0) {
      //   this.upmService.putUserPaymentMethod(result).subscribe({
      //     next: res => {
      //       this.upmService.userPaymentMethods = res as UserPaymentMethod[]    // list update

      //       this.paymentService.addRepairPayment(upmBeforeChange, result);

      //       this.toastr.success('Zaktualizowano konto płatnościowe: ' + result.paymentMethodName, 'Konto płatnościowe');
      //     },
      //     error: err => { 
      //       if (err.status == 400)
      //         this.toastr.error(err.error.message, "Nie dodano nowego konta płatnościowego")
      //       else
      //         console.error('Error during adding new user payment method: ', err);
      //     }
      //   })
      // }
      this.upmService.choosedUpm = new UserPaymentMethod()
    });
  }
}
