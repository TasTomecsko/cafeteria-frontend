export function convertMillisToDate(milliseconds: number) {
    var converted_year = new Date(milliseconds).getFullYear().toString();
    var converted_month = (new Date(milliseconds).getMonth() + 1).toString();
    var converted_day = new Date(milliseconds).getDate().toString();

    if(converted_month.length == 1) {
        converted_month = '0' + converted_month; 
    }
    if(converted_day.length == 1) {
        converted_day = '0' + converted_day;
    }

    return converted_year + '.' + converted_month + '.' + converted_day + '.';
}