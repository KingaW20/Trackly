import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';

import { AuthService } from './services/auth.service';
import { Paths } from './constants';

//kind of middleware - added to app.config
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const toastr = inject(ToastrService)
  
  //To add JWT to all necessary requests
  if (authService.isLoggedId()) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authService.getToken())
    })
    return next(clonedReq).pipe(
      tap({
        error: (err : any) => {
          if (err.status == 401) {    // don't have a valid token (not valid or expired)
            authService.deleteToken()
            setTimeout(() => {
              toastr.info('Proszę zalogować się ponownie', 'Sesja wygasła')
            }, 1000)
            router.navigateByUrl(Paths.SIGN_IN)
          }
          else if (err.status == 403)
            toastr.error('Ups! Wygląda na to, że nie masz uprawnień do wykonania tej czynności.', 'Brak dostępu')
        }
      })
    );
  }

  return next(req);
};
