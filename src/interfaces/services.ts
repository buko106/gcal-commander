import { calendar_v3 as calendarV3 } from 'googleapis';

export interface ListEventsParams {
  calendarId: string;
  maxResults: number;
  timeMax: string;
  timeMin: string;
}

export interface CreateEventParams {
  attendees?: string[];
  calendarId: string;
  description?: string;
  end: CalendarDateTime;
  location?: string;
  sendUpdates?: 'all' | 'externalOnly' | 'none';
  start: CalendarDateTime;
  summary: string;
}

export interface CalendarDateTime {
  date?: string;      // YYYY-MM-DD for all-day events
  dateTime?: string;  // RFC3339 timestamp
  timeZone?: string;
}

export interface ICalendarService {
  createEvent(params: CreateEventParams): Promise<calendarV3.Schema$Event>;
  getEvent(eventId: string, calendarId: string): Promise<calendarV3.Schema$Event>;
  listCalendars(): Promise<calendarV3.Schema$CalendarListEntry[]>;
  listEvents(params: ListEventsParams): Promise<calendarV3.Schema$Event[]>;
}

export interface AuthResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any;
}

export interface IAuthService {
  getCalendarAuth(): Promise<AuthResult>;
}

export interface SelectChoice {
  name: string;
  value: string;
}

export interface IPromptService {
  confirm(message: string, defaultValue?: boolean): Promise<boolean>;
  select(message: string, choices: SelectChoice[]): Promise<string>;
}

export interface II18nService {
  init(): Promise<void>;
  t(key: string, options?: any): string;
  changeLanguage(language: string): Promise<void>;
  getAvailableLanguages(): string[];
}