import { Component, Input } from '@angular/core';
import { ChartType } from 'ng-apexcharts';
import { UserAccountBalance } from '../../shared/models/payments/user-account-balance.model';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-account-history',
  standalone: true,
  imports: [ 
    CommonModule, NgApexchartsModule 
  ],
  templateUrl: './account-history.component.html',
  styles: ``
})
export class AccountHistoryComponent {
  @Input() userAccountBalance!: UserAccountBalance;
  @Input() choosedAccountName!: string;

  public chartOptions = {
    // series: [100, 200, 300, 400],
    chart: {
      type: 'pie' as ChartType,
      width: '325',
    },
    // labels: ['A', 'B', 'C', 'D'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { width: '100%' },
        legend: { position: 'bottom' },
      }
    }],
  };

  getSeries(data: Record<string, number>) {
    return Object.values(data);
  }

  getLabels(data: Record<string, number>) {
    return Object.keys(data);
  }

}
