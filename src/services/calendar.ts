import { calendar_v3 as calendarV3, google } from 'googleapis';

import { IAuthService, ICalendarService, ListEventsParams } from '../interfaces/services';

export class CalendarService implements ICalendarService {
  private calendar: calendarV3.Calendar | null = null;

  constructor(private authService: IAuthService) {}

  async getEvent(eventId: string, calendarId = 'primary'): Promise<calendarV3.Schema$Event> {
    await this.ensureInitialized();
    try {
      const response = await this.calendar!.events.get({
        calendarId,
        eventId,
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get event: ${error}`);
    }
  }

  async listCalendars(): Promise<calendarV3.Schema$CalendarListEntry[]> {
    await this.ensureInitialized();
    try {
      const response = await this.calendar!.calendarList.list();
      return response.data.items || [];
    } catch (error) {
      throw new Error(`Failed to list calendars: ${error}`);
    }
  }

  async listEvents(params: ListEventsParams): Promise<calendarV3.Schema$Event[]> {
    await this.ensureInitialized();
    const {
      calendarId,
      maxResults,
      timeMax,
      timeMin,
    } = params;

    try {
      const response = await this.calendar!.events.list({
        calendarId,
        maxResults,
        orderBy: 'startTime',
        singleEvents: true,
        timeMax,
        timeMin,
      });

      return response.data.items || [];
    } catch (error) {
      throw new Error(`Failed to list events: ${error}`);
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.calendar) {
      const auth = await this.authService.getCalendarAuth();
      this.calendar = google.calendar({ auth: auth.client, version: 'v3' });
    }
  }
}