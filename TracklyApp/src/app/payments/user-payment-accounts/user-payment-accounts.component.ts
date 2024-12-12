import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { UserPaymentMethod } from '../../shared/models/user-payment-method.model';
import { UserPaymentMethodComponent } from '../user-payment-method/user-payment-method.component';
import { UserPaymentMethodService } from '../../shared/services/user-payment-method.service';

@Component({
  selector: 'app-user-payment-accounts',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './user-payment-accounts.component.html',
  styles: ``
})
export class UserPaymentAccountsComponent {

  dialogRef : any = null
  isMouseHover : boolean = false

  constructor( 
    public upmService : UserPaymentMethodService, 
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.upmService.refreshList();
  }

  onDelete(upm: UserPaymentMethod) : void {
    if (confirm("Czy na pewno chcesz usunąć konto " + upm.paymentMethodName + "?"))
    {
      this.upmService.deleteUserPaymentMethod(upm.id).subscribe({
        next: res => {
          this.upmService.userPaymentMethods = res as UserPaymentMethod[]    // list update
          this.toastr.info('Usunięto pomyślnie', 'Konto płatnościowe');
        },
        error: err => { console.log(err) }
      })
    }
  }

  onEdit(upm: UserPaymentMethod) : void {
    this.upmService.choosedUpm = Object.assign({}, upm)
    this.dialogRef = this.dialog.open(UserPaymentMethodComponent)

    this.dialogRef.afterClosed().subscribe( () => {
      var result = this.upmService.choosedUpm
      if (result.id != 0) {
        console.log(result)
        this.upmService.putUserPaymentMethod(result).subscribe({
          next: res => {
            this.upmService.userPaymentMethods = res as UserPaymentMethod[]    // list update
            this.toastr.success('Zaktualizowano konto płatnościowe: ' + result.paymentMethodName, 'Konto płatnościowe');
          },
          error: err => { 
            if (err.status == 400)
              this.toastr.error(err.error.message, "Nie dodano nowego konta płatnościowego")
            else
              console.log('Error during adding new user payment method: ', err);
          }
        })
      }
      this.upmService.choosedUpm = new UserPaymentMethod()
    });
  }
}
