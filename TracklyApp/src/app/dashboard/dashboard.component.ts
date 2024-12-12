import { Component, OnInit } from '@angular/core';

import { claimReq } from '../shared/utils/claimReq-utils';
import { HideIfClaimsNotMetDirective } from '../shared/directives/hide-if-claims-not-met.directive';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ HideIfClaimsNotMetDirective ],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {

  login: string = ""
  claimReq = claimReq

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (res: any) => this.login = res.login,
      error: (err: any) => console.log('Error while retrieving user profile:\n', err)
    })
  }
}
