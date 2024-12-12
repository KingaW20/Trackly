import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';

import { ChangeDateFormatToString } from '../../shared/utils/date-format';
import { Payment } from '../../shared/models/payment.model';
import { PaymentCategoryService } from '../../shared/services/payment-category.service';
import { PaymentService } from '../../shared/services/payment.service';
import { UserPaymentMethod } from '../../shared/models/user-payment-method.model';
import { UserPaymentMethodComponent } from '../user-payment-method/user-payment-method.component';
import { UserPaymentMethodService } from '../../shared/services/user-payment-method.service';
import { Values } from '../../shared/constants';

@Component({
  selector: 'app-transfer-form',
  standalone: true,
  imports: [
    FormsModule, CommonModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule
  ],
  templateUrl: './transfer-form.component.html',
  styles: ``,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    provideNativeDateAdapter()
  ]
})
export class TransferFormComponent {

  @ViewChild('form') form?: NgForm;

  dialogRef : any = null
  date : Date | null = null

  constructor(
    public service : PaymentService, 
    public categoryService: PaymentCategoryService, 
    public userPaymentMethodService: UserPaymentMethodService, 
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.categoryService.refreshList();
    this.userPaymentMethodService.refreshList();
  }

  onMethodFromChange(): void {
    this.service.transferFormData.from = 
      this.userPaymentMethodService.getUserPaymentMethodById(this.service.transferFormData.fromId);
    console.log(this.service.transferFormData.from)
  }

  onMethodToChange(): void {
    this.service.transferFormData.to = 
      this.userPaymentMethodService.getUserPaymentMethodById(this.service.transferFormData.toId);
    console.log(this.service.transferFormData.to)
  }

  onDateChange(event: Date | null): void {
    if (event) 
      this.service.transferFormData.date = ChangeDateFormatToString(event)
    else 
      this.service.transferFormData.date = '';
  }

  clearForm(): void {
    this.service.resetForm(this.form)
  }

  onSubmit(form: NgForm) {
    this.service.formSubmitted = true
    if(form.valid)
    {
      this.insertRecord()
      this.closeForm();
    }
  }

  closeForm() {
    this.clearForm()
    this.service.transferFormShown = !this.service.transferFormShown
  }

  insertRecord() {
    var payments = this.createPaymentsFromTransfer()

    //Post two payments
    if (payments.length > 0) 
    {
      this.postPayment(payments[0])
      this.postPayment(payments[1])
    }
  }

  onAddNewMethod() {
    this.dialogRef = this.dialog.open(UserPaymentMethodComponent);

    this.dialogRef.afterClosed().subscribe( () => {
      var result = this.userPaymentMethodService.choosedUpm
      if (result.id != 0) {
        this.userPaymentMethodService.addUserPaymentMethod(result).subscribe({
          next: res => {
            this.userPaymentMethodService.userPaymentMethods = res as UserPaymentMethod[]    // list update
            this.toastr.success('Dodano nowe konto płatnościowe: ' + result.paymentMethodName, 'Metoda płatności');
          },
          error: err => { 
            if (err.status == 400)
              this.toastr.error(err.error.message, "Nie dodano nowego konta płatnościowego")
            else
              console.log('Error during adding new user payment method: ', err);
          }
        })
      }
      this.userPaymentMethodService.choosedUpm = new UserPaymentMethod()
    });
  }

  postPayment(p: Payment){
    this.service.paymentFormData = Object.assign({}, p)
    this.service.postPayment().subscribe({
      next: res => {
        this.service.updateAllPayments(res as Payment[])    // list update
        // this.service.resetForm(form)
        this.toastr.success('Dodano pomyślnie płatność do ' + p.paymentCategoryName, 'Płatność');
        this.userPaymentMethodService.refreshList();
      },
      error: err => { console.log(err) }
    })
  }

  createPaymentsFromTransfer(): Payment[] {
    var result : Payment[] = [];
    var cat = this.categoryService.getCategoryByName(Values.TRANSFER);

    if (cat)
    {
      var p1 = new Payment({
        categoryId: cat!.id,
        userPaymentMethodId: this.service.transferFormData.fromId,
        description: "Przelew własny na konto " + this.service.transferFormData.to,
        sum : this.service.transferFormData.sum,
        date : this.service.transferFormData.date,
        isOutcome : true,
        paymentCategoryName : cat!.name,
        paymentMethodName : this.service.transferFormData.from
      })
  
      var p2 = new Payment({
        categoryId: cat.id,
        userPaymentMethodId: this.service.transferFormData.toId,
        description: "Przelew własny z konta " + this.service.transferFormData.from,
        sum : this.service.transferFormData.sum,
        date : this.service.transferFormData.date,
        isOutcome : false,
        paymentCategoryName : cat.name,
        paymentMethodName : this.service.transferFormData.to
      })    

      result.push(p1, p2);
    }

    return result
  }
}
