import { Component, Input } from '@angular/core';
import { UserAccountBalance } from '../../shared/models/payments/user-account-balance.model';
import { CommonModule } from '@angular/common';
import { KeyValComponent } from '../../shared/components/key-val/key-val.component';
import { ChartComponent } from '../../shared/components/chart/chart.component';

@Component({
  selector: 'app-account-history',
  standalone: true,
  imports: [ CommonModule, KeyValComponent, ChartComponent ],
  templateUrl: './account-history.component.html',
  styles: ``
})
export class AccountHistoryComponent {
  @Input() userAccountBalance!: UserAccountBalance;
  @Input() choosedAccountName!: string;

  getSeries(data: Record<string, number>) {
    return Object.values(data);
  }

  getLabels(data: Record<string, number>) {
    return Object.keys(data);
  }

}
