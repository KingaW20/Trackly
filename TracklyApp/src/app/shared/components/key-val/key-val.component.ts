import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-key-val.row',
  standalone: true,
  imports: [],
  templateUrl: './key-val.component.html'
})
export class KeyValComponent {
  @Input({ required: true }) key: string = "";
  @Input({ required: true }) val: string | number = "";
}
