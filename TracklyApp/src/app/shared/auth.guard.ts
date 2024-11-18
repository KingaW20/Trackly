import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedId())
  {
    const claimReq = route.data['claimReq'] as Function;
    if (claimReq) {
      const claims = authService.getClaims();
      console.log(claims);
      if (!claimReq(claims)) {
        router.navigateByUrl('/forbidden');
        return false;
      }
    }
    return true;
  }
  
  router.navigateByUrl('/signin');
  return false;
};
