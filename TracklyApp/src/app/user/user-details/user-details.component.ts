import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { claimReq } from '../../shared/utils/claimReq-utils';
import { User } from '../../shared/models/user.model';

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
      error: (err: any) => console.log('Error while retrieving user profile:\n', err)
    })
  }
}
