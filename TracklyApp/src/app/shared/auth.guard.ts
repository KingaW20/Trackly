import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './services/auth.service';
import { Paths } from './constants';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedId())
  {
    const claimReq = route.data['claimReq'] as Function;
    if (claimReq) {
      const claims = authService.getClaims();
      if (!claimReq(claims)) {
        router.navigateByUrl(Paths.FORBIDDEN);
        return false;
      }
    }
    return true;
  }
  
  router.navigateByUrl(Paths.SIGN_IN);
  return false;
};
