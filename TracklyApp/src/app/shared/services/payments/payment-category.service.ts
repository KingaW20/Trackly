import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../../environments/environment';
import { Paths } from '../../constants';
import { PaymentCategory } from '../../models/payments/payment-category.model';
import { PaymentCategoryComponent } from '../../../payments/payment-category/payment-category.component';

@Injectable({
  providedIn: 'root'
})
export class PaymentCategoryService {

  url : string = environment.apiBaseUrl + "/" + Paths.PAYMENT_CATEGORY
  paymentCategories : PaymentCategory[] = []

  constructor(
    private http: HttpClient, 
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  refreshList() {
    this.http.get(this.url).subscribe({
      next: res => { this.paymentCategories = res as PaymentCategory[]; },
      error: err => { console.error(err) }
    })
  }

  getCategoryById(id: number | null) {
    const cat = this.paymentCategories.find( category => category.id == id );
    return cat ? cat.name : '';
  }

  getCategoryByName(name: string) {
    var cat = this.paymentCategories.find( cat => cat.name == name );
    if (cat == null)
    {
      this.postCategory(name).subscribe({
        next: res => {
          this.paymentCategories = res as PaymentCategory[]    // list update
          this.toastr.success('Dodano nową kategorię: ' + name, 'Kategoria');
        },
        error: err => {
          if (err.status == 400)
            this.toastr.error(err.error.message, "Nie dodano nowej kategorii")
          else
            console.error('Error during adding new payment category:\n', err)}
      })
      cat = this.paymentCategories.find( cat => cat.name == name );
    }
    return cat ? cat : null
  }

  postCategory(categoryName: string) {
    return this.http.post(this.url, { name : categoryName } )
  }

  putCategory(cat: PaymentCategory) {
    return this.http.put(this.url + "/" + cat.id, cat)
  }

  deleteCategory(id: number) {
    return this.http.delete(this.url + "/" + id)
  }

  onAddNewCategory() {
    this.dialog
      .open(PaymentCategoryComponent)
      .afterClosed().subscribe( (result: { name: string } | undefined) => {
        if (result && result!.name) {
          this.postCategory(result.name).subscribe({
            next: res => {
              this.paymentCategories = res as PaymentCategory[]    // list update
              this.toastr.success('Dodano nową kategorię: ' + result.name, 'Kategoria');
            },
            error: err => {
              if (err.status == 400)
                this.toastr.error(err.error.message, "Nie dodano nowej kategorii")
              else
                console.error('Error during adding new payment category:\n', err)}
          })
        }
      });
  }

  onEditCategory(cat : PaymentCategory) : void {
    this.dialog
      .open(PaymentCategoryComponent, {
        data: { categoryName: cat.name }
      })
      .afterClosed().subscribe( (result: { name: string } | undefined) => {
      if (result && result!.name) {
        let newCategory = Object.assign({}, cat)
        newCategory.name = result.name
        this.putCategory(newCategory).subscribe({
          next: res => {
            this.paymentCategories = res as PaymentCategory[]    // list update
            this.toastr.success('Pomyślnie zmodyfikowano kategorię', 'Kategoria');
          },
          error: err => {
            if (err.status == 400)
              this.toastr.error(err.error.message, "Nie zmodyfikowano kategorii")
            else
              console.error('Error during putting payment category:\n', err)}
        })
      }
    })
  }

  onDeleteCategory(cat : PaymentCategory) : void {
    //TODO: delete also payments with this category if user is ok with that
    if (cat.isPaymentWithCategoryExists)
      this.toastr.error("Nie można usunąć kategorii, ponieważ niektóre płatności jej dotyczą", "Nie usunięto kategorii")
    else if (confirm("Czy na pewno chcesz usunąć tę kategorię płatności?"))
    {
      this.deleteCategory(cat.id!).subscribe({
        next: res => {
          this.paymentCategories = res as PaymentCategory[]    // list update
          this.toastr.info('Pomyślnie usunięto', 'Kategoria');
        },
        error: err => {
          if (err.status == 400)
            this.toastr.error(err.error.message, "Nie usunięto kategorii")
          else
            console.error('Error during deleting payment category:\n', err)}
      })
    }
  }
}
