import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from "@angular/forms";
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../shared/services/auth.service';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';
import { FormUtilsService } from '../../shared/services/form-utils.service';
import { Paths } from '../../shared/constants';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, FirstKeyPipe, RouterLink ],
  templateUrl: './registration.component.html',
  styles: ``
})
export class RegistrationComponent implements OnInit {

  passwordShown: boolean = false;
  confirmPasswordShown: boolean = false;
  form: FormGroup;
  isSubmitted: boolean = false;
  paths = Paths

  //https://angular.dev/api/forms/ValidatorFn#
  passwordMatchValidator: ValidatorFn = (control: AbstractControl) : null => {
    const password = control.get('password')
    const confirmPassword = control.get('confirmPassword')

    if (password && confirmPassword && password.value != confirmPassword.value)
      confirmPassword?.setErrors( {passwordMismatch: true} )
    else
      confirmPassword?.setErrors( null )

    return null;
  }

  //Password validators must be consistent with the api validators
  constructor(
    public formBuilder : FormBuilder, 
    private authService: AuthService, 
    private toastr: ToastrService,
    private router: Router,
    private formUtilsService: FormUtilsService
  ) { 
    this.form = this.formBuilder.group({
      login : ['', Validators.required],
      email : ['', [Validators.required, Validators.email]],
      password : ['', [
        Validators.required, Validators.minLength(6), Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)
      ]],
      confirmPassword : ['']
    }, {validators: this.passwordMatchValidator})
  }

  //To manage the access
  ngOnInit(): void {
    if (this.authService.isLoggedId())
      this.router.navigateByUrl('/dashboard');
  }

  onSubmit(){
    this.isSubmitted = true;
    if (this.form.valid) {
      this.authService.createUser(this.form.value).subscribe({
        next: (res: any) => {
          if (res.succeeded) {
            this.form.reset();
            this.isSubmitted = false;
            this.toastr.success('Utworzono nowego użytkownika', "Rejestracja się powiodła")
          }
        },
        error: err => {
          if (err.error.errors) {
            //to show errors about existing email and other errors from backend
            err.error.errors.forEach((x: any) => {
              switch(x.code) {
                case "DuplicateUserName":
                  this.toastr.error('Ta nazwa użytkownika jest już zajęta.', "Rejestracja się nie powiodła")
                  break;
  
                case "DuplicateEmail":
                  this.toastr.error('Adres email jest już zajęty. Proszę podać inny.', "Rejestracja się nie powiodła")
                  break;
  
                default:
                  this.toastr.error('Skontaktuj się z deweloperem.', "Rejestracja się nie powiodła")
                  console.log(x);
                  break;
              }
            })
          }
          else {
            console.log('error: ', err);
          }
        }
      });
    }
  }

  showPassword(confirm: boolean) {
    if (confirm) this.confirmPasswordShown = !this.confirmPasswordShown;
    else this.passwordShown = !this.passwordShown;
  }

  hasDisplayableError(controlName: string): boolean {
    return this.formUtilsService.hasDisplayableError(this.form, controlName, this.isSubmitted);
  }

}
