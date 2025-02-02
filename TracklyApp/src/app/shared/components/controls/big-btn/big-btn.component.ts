import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'button.big',
  standalone: true,
  imports: [],
  templateUrl: './big-btn.component.html',
  host: {
    class: "btn btn-lg btn-success mb-3"
  }
})
export class BigBtnComponent {
  
}
