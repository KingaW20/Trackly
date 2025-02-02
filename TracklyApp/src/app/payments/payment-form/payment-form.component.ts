import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from "@angular/forms";
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';

import { ChangeDateFormatToString, GetFirstDayOfMonth, GetFirstDayOfNextMonth } from '../../shared/utils/date-format';
import { Payment } from '../../shared/models/payments/payment.model';
import { PaymentCategoryService } from '../../shared/services/payments/payment-category.service';
import { PaymentService } from '../../shared/services/payments/payment.service';
import { UserPaymentMethod } from '../../shared/models/payments/user-payment-method.model';
import { UserPaymentMethodComponent } from '../user-payment-method/user-payment-method.component';
import { UserPaymentMethodService } from '../../shared/services/payments/user-payment-method.service';
import { Values } from '../../shared/constants';
import { UserPaymentHistoryService } from '../../shared/services/payments/user-payment-history.service';


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
    public userPaymentHistoryService: UserPaymentHistoryService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.categoryService.refreshList()
    this.userPaymentMethodService.refreshList();
    this.userPaymentHistoryService.refreshList();
    this.cdr.detectChanges();
  }

  onCategoryChange(): void {
    this.service.paymentFormData.paymentCategoryName = 
      this.categoryService.getCategoryById(this.service.paymentFormData.categoryId);
  }

  onMethodChange(): void {
    this.service.paymentFormData.paymentMethodName = 
      this.userPaymentMethodService.getUserPaymentMethodById(this.service.paymentFormData.userPaymentMethodId)?.paymentMethodName ?? '';
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
    const payment = Object.assign({}, this.service.paymentFormData);
    this.service.postPayment(payment);
    this.service.resetForm(form);
  }
  
  updateRecord(form: NgForm) {
    const paymentAfter = Object.assign({}, this.service.paymentFormData);
    const paymentBefore = this.service.getPaymentById(paymentAfter.id);

    this.service.putPayment(this.service.paymentFormData).subscribe({
      next: res => {
        this.service.updateAllPayments(res as Payment[])
        this.service.resetForm(form)
        this.toastr.info('Zmodyfikowano pomyślnie', 'Płatność');
        this.userPaymentHistoryService.includePayment(
          paymentBefore?.date ?? "", paymentBefore?.userPaymentMethodId ?? null, paymentBefore?.sum ?? null, !(paymentBefore?.isOutcome ?? true));
        this.userPaymentHistoryService.includePayment(
          paymentAfter?.date ?? "", paymentAfter?.userPaymentMethodId ?? null, paymentAfter?.sum ?? null, paymentAfter?.isOutcome ?? true);
        this.userPaymentMethodService.refreshList();
      },
      error: err => { console.error(err) }
    })
  }

  onAddNewUserPaymentMethod() {
    this.dialogRef = this.dialog.open(UserPaymentMethodComponent);

    this.dialogRef.afterClosed().subscribe( () => {
      const result = this.userPaymentMethodService.choosedUpm
      const choosedDate = this.userPaymentMethodService.choosedDate;
      if (result.paymentMethodName != null) {
        this.userPaymentMethodService.postUserPaymentMethod(result).subscribe({
          next: res => {
            this.userPaymentMethodService.userPaymentMethods = res as UserPaymentMethod[]    // list update

            const date = GetFirstDayOfMonth(choosedDate);
            this.userPaymentHistoryService.postUserPaymentHistory(result, date, true);
            
            const date2 = GetFirstDayOfNextMonth(choosedDate);
            this.userPaymentHistoryService.postUserPaymentHistory(result, date2, false);

            this.toastr.success('Dodano nowe konto płatnościowe: ' + result.paymentMethodName, 'Metoda płatności');
          },
          error: err => { 
            if (err.status == 400)
              this.toastr.error(err.error.message, "Nie dodano nowego konta płatnościowego")
            else
              console.error('Error during adding new user payment method: ', err);
          }
        })
      }
      this.userPaymentMethodService.choosedUpm = new UserPaymentMethod()
      this.userPaymentMethodService.choosedDate = null;
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
