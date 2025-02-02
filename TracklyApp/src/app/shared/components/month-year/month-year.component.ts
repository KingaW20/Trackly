import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MonthNames } from '../../utils/date-format';
import { MonthYearService } from '../../services/month-year.service';
import { Values } from '../../constants';

@Component({
  selector: 'app-month-year',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './month-year.component.html',
  styleUrl: './month-year.component.css'
})
export class MonthYearComponent {

  @Input() service!: MonthYearService;
  @Input() list!: any[];
  Object = Object

  choosedYear = "";
  choosedMonth = Values.ALL_YEAR;
  yearMonths : Record<string, string[]> = {}

  ngOnInit() {
    const currentDate = new Date();
    this.choosedYear = currentDate.getFullYear().toString();
    this.choosedMonth = Values.ALL_YEAR;
    this.yearMonths = this.service.getYearMonths();  
    // console.log("YearMonths", this.yearMonths)  
    this.updateView();
  }

  getYears() {
    return Object.keys(this.yearMonths);
  }

  getMonths() {
    const sortedMonths = Object.entries(MonthNames)
      .sort(([monthNumber1], [monthNumber2]) => parseInt(monthNumber1) - parseInt(monthNumber2))
      .map(([key, value]) => value);

    return [Values.ALL_YEAR, ...sortedMonths];
  }

  chooseYear(year: string) {
    if (!this.yearMonths[year].includes(this.choosedMonth))
      this.choosedMonth = Values.ALL_YEAR;
    this.choosedYear = year;
    this.updateView();
  }

  chooseMonth(month: string) {
    this.choosedMonth = month;
    this.updateView();
  }

  updateView() {  
    var month = "";
    for (const key in MonthNames) {
      if (MonthNames[key] === this.choosedMonth)
        month = key;
    }
    if (month != "") this.service.monthYear = month + "/" + this.choosedYear;
    else this.service.monthYear = this.choosedYear;
    this.service.getInfo(this.list);
  }
}
