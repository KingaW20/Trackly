import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChartType, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [ CommonModule, NgApexchartsModule ],
  templateUrl: './chart.component.html',
  styles: ``,
  host: {
    class: "d-block"
  }
})
export class ChartComponent {
  @Input({ required: true }) title : string = "";
  @Input({ required: true }) labels : string[] = [];
  @Input({ required: true }) series : number[] = [];

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
}
