export function ChangeDateFormatToString(date: Date) : string {
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