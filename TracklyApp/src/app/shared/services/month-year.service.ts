import { Injectable } from '@angular/core';
import { ChangeDateFormatFromMonthYearToDate, ChangeDateFormatFromYearToDate, ChangeDateFormatToDate, GetFirstDayOfNextMonth, MonthNames } from '../utils/date-format';
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
      console.error("MonthYearService.GetInfo() - Wrong date format: ", this.monthYear);
    }

    this.startDate = ChangeDateFormatToDate(this.startDateStr);
    this.endDate= ChangeDateFormatToDate(this.endDateStr);
  }

  getYearMonths(dates: string[] | null = null) : Record<string, string[]> {
    dates = [...new Set(dates)];
    var result : Record<string, string[]> = {};
    // console.log("getYearMonths.dates", dates);
    if (dates != null) {
      dates.forEach(
        d => {
          const [day, month, year] = d.split('-');
          if (dates.find(d2 => d2 == GetFirstDayOfNextMonth(ChangeDateFormatToDate(d)))) {
            if (year in result && !result[year].includes(MonthNames[month])) 
              result[year].push(MonthNames[month]);
            else if (!(year in result))
              result[year] = [Values.ALL_YEAR, MonthNames[month]]
          }
        }
      );
    }
    return result;
  }
}
