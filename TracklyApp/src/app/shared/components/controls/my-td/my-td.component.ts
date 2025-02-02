import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'td.my-td',
  standalone: true,
  imports: [],
  templateUrl: './my-td.component.html',
  host: {
    style: "cursor: pointer"
  }
})
export class MyTdComponent {
  @Input({ required: true }) isOutcome: boolean = false;

  @HostBinding('class.text-danger') get isOutcomeClass() {
    return this.isOutcome;
  }

  @HostBinding('class.text-success') get isIncomeClass() {
    return !this.isOutcome;
  }
}
