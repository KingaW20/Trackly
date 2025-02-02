import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { AuthService } from '../../shared/services/auth.service';
import { claimReq } from '../../shared/utils/claimReq-utils';
import { HideIfClaimsNotMetDirective } from '../../shared/directives/hide-if-claims-not-met.directive';
import { Paths } from '../../shared/constants';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [ RouterOutlet, RouterLink, HideIfClaimsNotMetDirective ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

  claimReq = claimReq
  paths = Paths

  constructor(
    private router: Router, 
    private authService: AuthService
  ) { }

  onLogout() {
    this.authService.deleteToken(); 
    this.router.navigateByUrl(Paths.SIGN_IN)
  }

  onAccount() {
    this.router.navigateByUrl(Paths.USER_DETAILS)
  }
}
