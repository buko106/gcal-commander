import { calendar_v3 as calendarV3, google } from 'googleapis';
import { unlink } from 'node:fs/promises';
import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../di/tokens';
import { CreateEventParams, IAuthService, ICalendarService, ListEventsParams } from '../interfaces/services';
import { AppPaths } from '../utils/paths';

@injectable()
export class CalendarService implements ICalendarService {
  private calendar: calendarV3.Calendar | null = null;
  private hasReauthenticated = false;

  constructor(@inject(TOKENS.AuthService) private authService: IAuthService) {}

  async createEvent(params: CreateEventParams): Promise<calendarV3.Schema$Event> {
    return this.withRetryOnScopeError(async () => {
      await this.ensureInitialized();

      const eventResource: calendarV3.Schema$Event = {
        description: params.description,
        end: params.end,
        location: params.location,
        start: params.start,
        summary: params.summary,
      };

      if (params.attendees?.length) {
        eventResource.attendees = params.attendees.map((email) => ({ email }));
      }

      try {
        const response = await this.calendar!.events.insert({
          calendarId: params.calendarId,
          requestBody: eventResource,
          sendUpdates: params.sendUpdates || 'none',
        });

        return response.data;
      } catch (error) {
        throw new Error(`Failed to create event: ${error}`);
      }
    });
  }

  async getEvent(eventId: string, calendarId = 'primary'): Promise<calendarV3.Schema$Event> {
    return this.withRetryOnScopeError(async () => {
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
    });
  }

  async listCalendars(): Promise<calendarV3.Schema$CalendarListEntry[]> {
    return this.withRetryOnScopeError(async () => {
      await this.ensureInitialized();
      try {
        const response = await this.calendar!.calendarList.list();
        return response.data.items || [];
      } catch (error) {
        throw new Error(`Failed to list calendars: ${error}`);
      }
    });
  }

  async listEvents(params: ListEventsParams): Promise<calendarV3.Schema$Event[]> {
    return this.withRetryOnScopeError(async () => {
      await this.ensureInitialized();
      const { calendarId, maxResults, timeMax, timeMin } = params;

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
    });
  }

  private async deleteTokenAndReinitialize(): Promise<void> {
    const TOKEN_PATH = AppPaths.getTokenPath();
    try {
      await unlink(TOKEN_PATH);
      // Token deleted, will re-authenticate with updated permissions
    } catch {
      // Token file might not exist, which is fine
    }

    this.calendar = null;
    this.hasReauthenticated = true;
    await this.ensureInitialized();
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.calendar) {
      const auth = await this.authService.getCalendarAuth();
      this.calendar = google.calendar({ auth: auth.client, version: 'v3' });
    }
  }

  private isScopeError(error: unknown): boolean {
    const errorString = String(error);
    return (
      errorString.includes('insufficient authentication scopes') ||
      errorString.includes('Request had insufficient authentication scopes') ||
      errorString.includes('access_denied') ||
      errorString.includes('scope') ||
      errorString.includes('401') ||
      errorString.includes('403')
    );
  }

  private async withRetryOnScopeError<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (this.isScopeError(error) && !this.hasReauthenticated) {
        await this.deleteTokenAndReinitialize();
        return operation();
      }

      throw error;
    }
  }
}
