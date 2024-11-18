import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, RouterLink ],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  isSubmitted: boolean = false;

  //Password validators must be consistent with the api validators
  constructor(
    public formBuilder : FormBuilder, 
    private authService: AuthService, 
    private router: Router, 
    private toastr: ToastrService
  ) { 
    this.form = this.formBuilder.group({
      email : ['', Validators.required],
      password : ['', Validators.required]
    })
  }

  //To manage the access
  ngOnInit(): void {
    if (this.authService.isLoggedId())
      this.router.navigateByUrl('/dashboard');
  }

  onSubmit() {
    this.isSubmitted = true;
    if(this.form.valid) {
      this.authService.signin(this.form.value).subscribe({
        next: (res: any) => {
          this.authService.saveToken(res.token); 
          this.router.navigateByUrl('/dashboard')
        },
        error: err => {
          if (err.status == 400)
            this.toastr.error('Niepoprawny adres email lub hasło.', "Logowanie")
          else
            console.log('error during login:\n', err)
        }
      })
    }
  }

  //TODO: make this function global - registration.component has it also
  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) && (this.isSubmitted || Boolean(control?.touched))
  }
}
