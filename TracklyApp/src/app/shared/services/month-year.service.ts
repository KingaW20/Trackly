import { Injectable } from '@angular/core';
import { ChangeDateFormatFromMonthYearToDate, ChangeDateFormatFromYearToDate, ChangeDateFormatToDate, MonthNames } from '../utils/date-format';
import { Values } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class MonthYearService {

  public monthYear = "";

  public startDateStr = "";
  public endDateStr = "";

  public startDate : Date | null = null;
  public endDate : Date | null = null;

  constructor() { }

  getInfo(list: any[]) {
    const yearRegex = /^\d{4}$/;
    const monthYearRegex = /^\d{2}\/\d{4}$/;

    if (monthYearRegex.test(this.monthYear)) {
      this.startDateStr = ChangeDateFormatFromMonthYearToDate(this.monthYear, false);
      this.endDateStr = ChangeDateFormatFromMonthYearToDate(this.monthYear, true);
    } else if (yearRegex.test(this.monthYear)) {
      this.startDateStr = ChangeDateFormatFromYearToDate(this.monthYear, false);
      this.endDateStr = ChangeDateFormatFromYearToDate(this.monthYear, true);
    } else {
      console.log("MonthYearService.GetInfo() - Wrong date format: ", this.monthYear);
    }

    this.startDate = ChangeDateFormatToDate(this.startDateStr);
    this.endDate= ChangeDateFormatToDate(this.endDateStr);
  }

  getYearMonths(dates: string[] | null = null) : Record<string, string[]> {
    var result : Record<string, string[]> = {};
    if (dates != null) {
      dates.forEach(
        d => {
          const [day, month, year] = d.split('-');
          if (year in result && !result[year].includes(MonthNames[month])) 
            result[year].push(MonthNames[month]);
          else if (!(year in result))
            result[year] = [Values.ALL_YEAR, MonthNames[month]]
        }
      );
    }
    return result;
  }
}
