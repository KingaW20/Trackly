export function ChangeDateFormatToString(date: Date | null) : string {
    if (date == null) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export function ChangeDateFormatToDate(date: string) : Date | null {
    if (date == "") return null;

    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(date))
        throw new Error("Invalid date format. Expected DD-MM-YYYY.");

    const [day, month, year] = date.split('-').map(Number);
    const result = new Date(year, month - 1, day);
    if (result.getFullYear() !== year || result.getMonth() !== month - 1 || result.getDate() !== day)
        throw new Error("Invalid date value.");

    return result;
}

export function ChangeDateFormatFromMonthYearToDate(monthYear: string, addMonth: boolean): string {
  const [month, year] = monthYear.split('/');
  const date = new Date(ChangeDateFormatToDate(`01-${month}-${year}`)!);
  if (addMonth) date.setMonth(date.getMonth() + 1);  
  return ChangeDateFormatToString(date);
}

export function ChangeDateFormatFromYearToDate(year: string, addYear: boolean): string {
  const date = new Date(ChangeDateFormatToDate(`01-01-${year}`)!);
  if (addYear) date.setFullYear(date.getFullYear() + 1);
  return ChangeDateFormatToString(date);
}

export function CheckIfOneMonthDifference(date1 : Date, date2 : Date) : boolean {
  const year1 = date1.getFullYear();
  const month1 = date1.getMonth();
  
  const year2 = date2.getFullYear();
  const month2 = date2.getMonth();

  const yearDiff = year2 - year1;
  const monthDiff = month2 - month1;
  
  if ((yearDiff === 0 && monthDiff === 1) || (yearDiff === 1 && month1 === 11 && month2 === 0))
    return true;
  return false;
}

export function CheckIfDateBefore(dateStr1: string, dateStr2: string, orEqual: boolean = false) : boolean {
  const date1 = ChangeDateFormatToDate(dateStr1);
  const date2 = ChangeDateFormatToDate(dateStr2);

  if (date1 && date2) return orEqual ? date1 <= date2 : date1 < date2;
  else return false;
}

export function GetCurrentMonthYearString() {
  const currentDate = new Date();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear();
  return `${month}/${year}`;
}

export function GetFirstDayOfNextMonth(date: Date | null) : string {
    if (date == null) return '';

    const nextMonthDate = new Date(date);
    nextMonthDate.setMonth(date.getMonth() + 1);
    nextMonthDate.setDate(1);
    return ChangeDateFormatToString(nextMonthDate);
}

export function GetFirstDayOfMonth(date: Date | null) : string {
    if (date == null) return '';

    const nextMonthDate = new Date(date);
    nextMonthDate.setDate(1);
    return ChangeDateFormatToString(nextMonthDate);
}

export function GetFirstDaysOfMonthsBetween(date1: Date, date2: Date, withLast: boolean = true) {
  const result: Date[] = [];
  let current = new Date(date1.getFullYear(), date1.getMonth(), 1);

  while (withLast ? current <= date2 : current < date2) {
    result.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }

  return result;
}

export const MONTH_YEAR_DATE_FORMAT = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const MonthNames : Record<string, string> = {
  '01': 'Styczeń',
  '02': 'Luty',
  '03': 'Marzec',
  '04': 'Kwiecień',
  '05': 'Maj',
  '06': 'Czerwiec',
  '07': 'Lipiec',
  '08': 'Sierpień',
  '09': 'Wrzesień',
  '10': 'Październik',
  '11': 'Listopad',
  '12': 'Grudzień'
}