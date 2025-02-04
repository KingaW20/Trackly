import { Component, OnInit } from '@angular/core';

import { claimReq } from '../../shared/utils/claimReq-utils';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [],
  templateUrl: './user-details.component.html',
  styles: ``
})
export class UserDetailsComponent implements OnInit {

  user: User = new User
  claimReq = claimReq

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (res: any) => this.user = res as User,
      error: (err: any) => console.error('Error while retrieving user profile:\n', err)
    })
  }
}
