import { endOfDay, startOfDay } from "date-fns";

export enum DateFormatEnum {
  YYYY_MM_DD_HH_MM_SS = "YYYY-MM-DD HH:mm:ss",
}

export function convertDateToString(date: Date, format: DateFormatEnum) {
  if (format == DateFormatEnum.YYYY_MM_DD_HH_MM_SS) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  } else {
    return null;
  }
}

// export function selectStartOfDayTz7(start: Date) {
//     const startDate =  new Date(startOfDay(new Date(start)).getTime() - 7 * 3600000);
//     return startDate;
// }

// export function selectEndOfDayTz7(end: Date) {
//     const endDate = new Date(endOfDay(new Date(end)).getTime() - 7 * 3600000);
//     return endDate;
// }
