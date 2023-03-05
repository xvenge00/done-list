
export function toISOFormated(date: Date): {year: string, month: string, day: string} {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = `${date.getFullYear()}`;

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return {
        year,
        month,
        day
    }
}

export function toISOString(date: Date): string {
    let formated_date = toISOFormated(date);
    return `${formated_date.year}-${formated_date.month}-${formated_date.day}`
}