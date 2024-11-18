import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {

  //To show errors only to invalid SUBMITTED form or touched inputPlace
  //We can add to return (... || Boolean(control?.dirty)) - that means that error will show up during writing
  hasDisplayableError(form: FormGroup, controlName: string, isSubmitted: boolean): boolean {
    const control = form.get(controlName);
    return Boolean(control?.invalid) && (isSubmitted || Boolean(control?.touched))
  }
}