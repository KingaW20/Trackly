import { Component } from '@angular/core';
import { RegistrationComponent } from './registration/registration.component';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { trigger, style, animate, transition, query } from '@angular/animations';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ RegistrationComponent, RouterOutlet ],
  templateUrl: './user.component.html',
  styles: ``,
  animations: [                       //more info: https://angular.dev/guide/animations
    trigger('routerFadeIn', [         //name of the animation
      transition('* <=> *', [
        query(':enter', [            //argument selector - apply animation to router-outlet component
          style({ opacity: 0 }),
          animate('1s ease-in-out', style({ opacity: 1 }))
        ], { optional: true }),
      ])
    ])
  ]
})
export class UserComponent {

  constructor(private context: ChildrenOutletContexts) {

  }

  getRouteUrl() {
    return this.context.getContext('primary')?.route?.url;
  }

}
