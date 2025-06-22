import { Args, Flags } from '@oclif/core';
import { calendar_v3 as calendarV3 } from 'googleapis';

import { getCalendarAuth } from '../../auth';
import { BaseCommand } from '../../base-command';
import { CalendarService } from '../../services/calendar';

export default class EventsShow extends BaseCommand {
  static args = {
    eventId: Args.string({
      description: 'Event ID to show details for',
      required: true,
    }),
  };
static description = 'Show detailed information about a specific event';
static examples = [
    '<%= config.bin %> <%= command.id %> event123',
    '<%= config.bin %> <%= command.id %> event123 --calendar my-calendar@gmail.com',
    '<%= config.bin %> <%= command.id %> event123 --format json',
  ];
static flags = {
    ...BaseCommand.baseFlags,
    calendar: Flags.string({
      char: 'c',
      default: 'primary',
      description: 'Calendar ID where the event is located',
    }),
    format: Flags.string({
      char: 'f',
      default: 'table',
      description: 'Output format',
      options: ['table', 'json'],
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(EventsShow);

    try {
      this.logStatus('Authenticating with Google Calendar...');
      const auth = await getCalendarAuth();
      const calendarService = new CalendarService(auth);

      this.logStatus(`Fetching event details...`);
      const event = await calendarService.getEvent(args.eventId, flags.calendar);

      if (flags.format === 'json') {
        this.logJson(event);
      } else {
        this.displayEventDetails(event);
      }
    } catch (error) {
      this.logError(`Failed to show event: ${error}`);
    }
  }

  private displayAdditionalInfo(event: calendarV3.Schema$Event): void {
    if (event.recurrence && event.recurrence.length > 0) {
      this.logResult('\nRecurrence:');
      for (const [index, rule] of event.recurrence.entries()) {
        this.logResult(`  ${index + 1}. ${rule}`);
      }
    }
    
    if (event.htmlLink) {
      this.logResult(`\nGoogle Calendar Link: ${event.htmlLink}`);
    }
    
    if (event.created) {
      this.logResult(`Created: ${new Date(event.created).toLocaleString()}`);
    }
    
    if (event.updated) {
      this.logResult(`Last Updated: ${new Date(event.updated).toLocaleString()}`);
    }
  }

  private displayBasicInfo(event: calendarV3.Schema$Event): void {
    this.logResult(`Title: ${event.summary || '(No title)'}`);
    this.logResult(`ID: ${event.id}`);
    
    if (event.description) {
      this.logResult(`Description: ${event.description}`);
    }
    
    if (event.location) {
      this.logResult(`Location: ${event.location}`);
    }
    
    if (event.status) {
      this.logResult(`Status: ${event.status}`);
    }
  }

  private displayEventDetails(event: calendarV3.Schema$Event): void {
    this.logResult('\n=== Event Details ===\n');
    
    this.displayBasicInfo(event);
    this.displayTimeInfo(event);
    this.displayPeopleInfo(event);
    this.displayAdditionalInfo(event);
    
    this.logResult('');
  }

  private displayPeopleInfo(event: calendarV3.Schema$Event): void {
    if (event.creator) {
      this.logResult(`Creator: ${event.creator.displayName || event.creator.email}`);
    }
    
    if (event.organizer) {
      this.logResult(`Organizer: ${event.organizer.displayName || event.organizer.email}`);
    }
    
    if (event.attendees && event.attendees.length > 0) {
      this.logResult('\nAttendees:');
      for (const [index, attendee] of event.attendees.entries()) {
        const name = attendee.displayName || attendee.email;
        const status = attendee.responseStatus ? ` (${attendee.responseStatus})` : '';
        this.logResult(`  ${index + 1}. ${name}${status}`);
      }
    }
  }

  private displayTimeInfo(event: calendarV3.Schema$Event): void {
    if (event.start) {
      const startTime = event.start.dateTime || event.start.date;
      if (startTime) {
        const startDate = new Date(startTime);
        if (event.start.dateTime) {
          this.logResult(`Start: ${startDate.toLocaleString()}`);
        } else {
          this.logResult(`Start: ${startDate.toLocaleDateString()} (All day)`);
        }
      }
    }
    
    if (event.end) {
      const endTime = event.end.dateTime || event.end.date;
      if (endTime) {
        const endDate = new Date(endTime);
        if (event.end.dateTime) {
          this.logResult(`End: ${endDate.toLocaleString()}`);
        } else {
          this.logResult(`End: ${endDate.toLocaleDateString()} (All day)`);
        }
      }
    }
  }
}