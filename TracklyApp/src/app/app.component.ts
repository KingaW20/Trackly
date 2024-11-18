import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PaymentsComponent } from './payments/payments.component';
import { UserComponent } from './user/user.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PaymentsComponent, UserComponent],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  title = 'TracklyApp';
}
