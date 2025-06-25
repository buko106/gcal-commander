import { calendar_v3 as calendarV3 } from 'googleapis';

export interface DateTimeInfo {
  dateStr: string;
  isAllDay: boolean;
  timeStr: string;
}

export class DateFormatter {
  public static formatEventDateTime(eventTime: calendarV3.Schema$EventDateTime): DateTimeInfo | null {
    const timeValue = eventTime.dateTime || eventTime.date;
    if (!timeValue) return null;

    const date = new Date(timeValue);
    const isAllDay = !eventTime.dateTime;

    return {
      dateStr: date.toLocaleDateString(),
      isAllDay,
      timeStr: isAllDay 
        ? 'All day'
        : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  public static formatEventDateTimeString(eventTime: calendarV3.Schema$EventDateTime): null | string {
    const timeValue = eventTime.dateTime || eventTime.date;
    if (!timeValue) return null;

    const date = new Date(timeValue);
    const isAllDay = !eventTime.dateTime;

    return isAllDay 
      ? `${date.toLocaleDateString()} (All day)`
      : date.toLocaleString();
  }

  public static formatListEventTime(event: calendarV3.Schema$Event): null | { dateStr: string; timeStr: string } {
    if (!event.start) return null;

    const info = this.formatEventDateTime(event.start);
    if (!info) return null;

    return {
      dateStr: info.dateStr,
      timeStr: info.timeStr,
    };
  }

  public static formatShowEventTime(eventTime: calendarV3.Schema$EventDateTime, label: 'End' | 'Start'): null | string {
    const formatted = this.formatEventDateTimeString(eventTime);
    if (!formatted) return null;

    return `${label}: ${formatted}`;
  }
}