import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
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
  selector: 'app-payment-form',
  standalone: true,
  imports: [
    FormsModule, CommonModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule
  ],
  templateUrl: './payment-form.component.html',
  styles: ``,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
    provideNativeDateAdapter()
  ]
})
export class PaymentFormComponent {

  @ViewChild('form') form?: NgForm;

  dialogRef : any = null
  Values = Values

  constructor(
    public service : PaymentService, 
    public categoryService: PaymentCategoryService, 
    public userPaymentMethodService: UserPaymentMethodService, 
    private toastr: ToastrService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.categoryService.refreshList()
    this.userPaymentMethodService.refreshList();
    this.cdr.detectChanges();
  }

  onCategoryChange(): void {
    this.service.paymentFormData.paymentCategoryName = 
      this.categoryService.getCategoryById(this.service.paymentFormData.categoryId);
  }

  onMethodChange(): void {
    this.service.paymentFormData.paymentMethodName = 
      this.userPaymentMethodService.getUserPaymentMethodById(this.service.paymentFormData.userPaymentMethodId);
  }

  onDateChange(event: Date | null): void {
    if (event)
      this.service.paymentFormData.date = ChangeDateFormatToString(event)
    else 
      this.service.paymentFormData.date = '';
  }

  trackById(index: number, item: any): any {
    return item.id;
  }

  clearForm(): void {
    this.service.resetForm(this.form)
  }

  onSubmit(form: NgForm) {
    this.service.formSubmitted = true
    if(form.valid)
    {
      if (this.service.paymentFormData.id == 0)
        this.insertRecord(form)
      else
        this.updateRecord(form)
      this.closeForm();
    }
  }

  closeForm() {
    this.clearForm()
    this.service.paymentFormShown = !this.service.paymentFormShown
  }

  insertRecord(form: NgForm) {
    this.service.postPayment().subscribe({
      next: res => {
        this.service.updateAllPayments(res as Payment[])    // list update
        this.service.resetForm(form)
        this.toastr.success('Dodano pomyślnie', 'Płatność');
        this.userPaymentMethodService.refreshList();
      },
      error: err => { console.log(err) }
    })
  }
  
  updateRecord(form: NgForm) {
    this.service.putPayment().subscribe({
      next: res => {
        this.service.updateAllPayments(res as Payment[])
        this.service.resetForm(form)
        this.toastr.info('Zmodyfikowano pomyślnie', 'Płatność');
        this.userPaymentMethodService.refreshList();
      },
      error: err => { console.log(err) }
    })
  }

  onAddNewUserPaymentMethod() {
    this.dialogRef = this.dialog.open(UserPaymentMethodComponent);

    this.dialogRef.afterClosed().subscribe( () => {
      var result = this.userPaymentMethodService.choosedUpm
      if (result.paymentMethodName != null) {
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

  // openDialog() {
  //   this.dialogRef = this.dialog.open(PaymentFormComponent, {
  //     height: '550px',
  //     width: '350px',
  //     position: { top: '0px', left: '0px' },
  //   });

  //   // we can define actions with informations from the child component passed as { data : 'exampleData'}
  //   // this.dialogRef.afterClosed().subscribe((result: { data: string } | undefined) => {
  //   //   console.log('Dialog was closed', result);
  //   // });
  // }
}
