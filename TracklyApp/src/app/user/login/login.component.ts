import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Paths } from '../../shared/constants';
import { FormUtilsService } from '../../shared/services/form-utils.service';

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
  paths = Paths;

  //Password validators must be consistent with the api validators
  constructor(
    public formBuilder : FormBuilder, 
    private authService: AuthService, 
    private router: Router, 
    private toastr: ToastrService,
    private formUtilsService: FormUtilsService
  ) { 
    this.form = this.formBuilder.group({
      login : ['', Validators.required],
      password : ['', Validators.required]
    })
  }

  //To manage the access
  ngOnInit(): void {
    if (this.authService.isLoggedId())
      this.router.navigateByUrl(Paths.DASHBOARD);
  }

  onSubmit() {
    this.isSubmitted = true;
    if(this.form.valid) {
      this.authService.signin(this.form.value).subscribe({
        next: (res: any) => {
          this.authService.saveToken(res.token); 
          this.router.navigateByUrl(Paths.DASHBOARD)
        },
        error: err => {
          if (err.status == 400)
            this.toastr.error('Niepoprawny adres email lub hasło.', "Logowanie nie powiodło się")
          else
            console.log('error during login:\n', err)
        }
      })
    }
  }

  hasDisplayableError(controlName: string): boolean {
    return this.formUtilsService.hasDisplayableError(this.form, controlName, this.isSubmitted);
  }
}
