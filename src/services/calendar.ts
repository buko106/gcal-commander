import { calendar_v3 as calendarV3, google } from 'googleapis';

import { CalendarAuth } from '../auth';

export class CalendarService {
  private calendar: calendarV3.Calendar;

  constructor(auth: CalendarAuth) {
    this.calendar = google.calendar({ auth: auth.client, version: 'v3' });
  }

  async getEvent(eventId: string, calendarId = 'primary'): Promise<calendarV3.Schema$Event> {
    try {
      const response = await this.calendar.events.get({
        calendarId,
        eventId,
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get event: ${error}`);
    }
  }

  async listCalendars(): Promise<calendarV3.Schema$CalendarListEntry[]> {
    try {
      const response = await this.calendar.calendarList.list();
      return response.data.items || [];
    } catch (error) {
      throw new Error(`Failed to list calendars: ${error}`);
    }
  }

  async listEvents(options: {
    calendarId?: string;
    maxResults?: number;
    orderBy?: string;
    singleEvents?: boolean;
    timeMax?: string;
    timeMin?: string;
  } = {}): Promise<calendarV3.Schema$Event[]> {
    const {
      calendarId = 'primary',
      maxResults = 10,
      orderBy = 'startTime',
      singleEvents = true,
      timeMin = new Date().toISOString(),
    } = options;

    try {
      const response = await this.calendar.events.list({
        calendarId,
        maxResults,
        orderBy,
        singleEvents,
        timeMin,
      });

      return response.data.items || [];
    } catch (error) {
      throw new Error(`Failed to list events: ${error}`);
    }
  }
}