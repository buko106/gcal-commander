import { Args, Flags } from '@oclif/core';
import { calendar_v3 as calendarV3 } from 'googleapis';

import { BaseCommand } from '../../base-command';
import { CalendarDateTime, CreateEventParams } from '../../interfaces/services';

export default class EventsCreate extends BaseCommand {
  static args = {
    summary: Args.string({
      description: 'Event title/summary',
      required: true,
    }),
  };
static description = 'Create a new calendar event';
static examples = [
    '<%= config.bin %> <%= command.id %> "Team Meeting" --start "2024-01-15T14:00:00"',
    '<%= config.bin %> <%= command.id %> "Lunch" --start "2024-01-15T12:00:00" --duration 60',
    '<%= config.bin %> <%= command.id %> "Conference" --start "2024-01-15" --all-day',
    '<%= config.bin %> <%= command.id %> "Project Review" --start "2024-01-15T14:00:00" --end "2024-01-15T16:00:00" --location "Room A"',
  ];
static flags = {
    ...BaseCommand.baseFlags,
    'all-day': Flags.boolean({
      description: 'Create all-day event',
    }),
    attendees: Flags.string({
      description: 'Comma-separated list of attendee emails',
    }),
    calendar: Flags.string({
      char: 'c',
      default: 'primary',
      description: 'Calendar ID to create event in',
    }),
    description: Flags.string({
      description: 'Event description',
    }),
    duration: Flags.integer({
      char: 'd',
      description: 'Duration in minutes (alternative to --end)',
    }),
    end: Flags.string({
      char: 'e', 
      description: 'End date/time (ISO format)',
    }),
    location: Flags.string({
      char: 'l',
      description: 'Event location',
    }),
    'send-updates': Flags.string({
      default: 'none',
      description: 'Send event invitations',
      options: ['all', 'externalOnly', 'none'],
    }),
    start: Flags.string({
      char: 's',
      description: 'Start date/time (ISO format)',
      required: true,
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(EventsCreate);

    try {
      await this.initI18nService();
      this.logStatus(this.t('events.create.authenticating'));
      await this.initCalendarService();

      // Validate mutual exclusion of end and duration
      if (flags.end && flags.duration) {
        this.logError('Cannot specify both --end and --duration flags');
      }

      // Parse start time
      const startTime = this.parseDateTime(flags.start, flags['all-day']);
      
      // Calculate end time
      let endTime: CalendarDateTime;
      if (flags.end) {
        endTime = this.parseDateTime(flags.end, flags['all-day']);
      } else if (flags.duration) {
        endTime = this.calculateEndTime(startTime, flags.duration, flags['all-day']);
      } else {
        // Default to 1 hour duration
        endTime = this.calculateEndTime(startTime, 60, flags['all-day']);
      }

      // Parse attendees
      const attendees = flags.attendees ? flags.attendees.split(',').map(email => email.trim()) : undefined;

      // Create event parameters
      const createParams: CreateEventParams = {
        attendees,
        calendarId: flags.calendar,
        description: flags.description,
        end: endTime,
        location: flags.location,
        sendUpdates: flags['send-updates'] as 'all' | 'externalOnly' | 'none',
        start: startTime,
        summary: args.summary,
      };

      this.logStatus(this.t('events.create.creating'));
      const event = await this.calendarService.createEvent(createParams);

      if (this.format === 'json' || this.format === 'pretty-json') {
        this.outputJson(event);
      } else {
        this.displayEventCreated(event);
      }
    } catch (error) {
      this.logError(`Failed to create event: ${error}`);
    }
  }

  private calculateEndTime(startTime: CalendarDateTime, durationMinutes: number, isAllDay: boolean): CalendarDateTime {
    if (isAllDay && // For all-day events, add 1 day
      startTime.date) {
        const startDate = new Date(startTime.date);
        startDate.setDate(startDate.getDate() + 1);
        return { date: startDate.toISOString().split('T')[0] };
      }

    if (startTime.dateTime) {
      const startDate = new Date(startTime.dateTime);
      startDate.setMinutes(startDate.getMinutes() + durationMinutes);
      return { dateTime: startDate.toISOString() };
    }

    throw new Error('Invalid start time format');
  }

  private displayEventCreated(event: calendarV3.Schema$Event): void {
    this.logResult(this.t('events.create.success') + '\n');
    
    this.logResult(`${this.t('events.create.labels.title')}: ${event.summary || this.t('events.create.noTitle')}`);
    this.logResult(`${this.t('events.create.labels.id')}: ${event.id}`);
    
    if (event.start) {
      if (event.start.date) {
        this.logResult(`${this.t('events.create.labels.date')}: ${new Date(event.start.date).toLocaleDateString()}`);
      } else if (event.start.dateTime) {
        this.logResult(`${this.t('events.create.labels.start')}: ${new Date(event.start.dateTime).toLocaleString()}`);
      }
    }
    
    if (event.end && event.end.dateTime) {
      this.logResult(`${this.t('events.create.labels.end')}: ${new Date(event.end.dateTime).toLocaleString()}`);
    }
    
    if (event.location) {
      this.logResult(`${this.t('events.create.labels.location')}: ${event.location}`);
    }
    
    if (event.htmlLink) {
      this.logResult(`${this.t('events.create.labels.googleCalendarLink')}: ${event.htmlLink}`);
    }
    
    this.logResult('');
  }

  private parseDateTime(dateTimeString: string, isAllDay: boolean): CalendarDateTime {
    if (isAllDay) {
      // For all-day events, expect YYYY-MM-DD format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateTimeString)) {
        throw new Error('All-day events require date format YYYY-MM-DD');
      }

      return { date: dateTimeString };
    }

    // For timed events, expect ISO format
    try {
      const date = new Date(dateTimeString);
      if (Number.isNaN(date.getTime())) {
        throw new TypeError('Invalid date format');
      }

      return { dateTime: date.toISOString() };
    } catch {
      throw new Error('Invalid date/time format. Expected ISO format (e.g., 2024-01-15T14:00:00)');
    }
  }
}