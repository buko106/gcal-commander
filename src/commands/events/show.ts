import { Args, Command, Flags } from '@oclif/core';
import { calendar_v3 as calendarV3 } from 'googleapis';

import { getCalendarAuth } from '../../auth';
import { CalendarService } from '../../services/calendar';

export default class EventsShow extends Command {
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
      this.logToStderr('Authenticating with Google Calendar...');
      const auth = await getCalendarAuth();
      const calendarService = new CalendarService(auth);

      this.logToStderr(`Fetching event details...`);
      const event = await calendarService.getEvent(args.eventId, flags.calendar);

      if (flags.format === 'json') {
        this.logJson(event);
      } else {
        this.displayEventDetails(event);
      }
    } catch (error) {
      this.error(`Failed to show event: ${error}`);
    }
  }

  private displayAdditionalInfo(event: calendarV3.Schema$Event): void {
    if (event.recurrence && event.recurrence.length > 0) {
      this.log('\nRecurrence:');
      for (const [index, rule] of event.recurrence.entries()) {
        this.log(`  ${index + 1}. ${rule}`);
      }
    }
    
    if (event.htmlLink) {
      this.log(`\nGoogle Calendar Link: ${event.htmlLink}`);
    }
    
    if (event.created) {
      this.log(`Created: ${new Date(event.created).toLocaleString()}`);
    }
    
    if (event.updated) {
      this.log(`Last Updated: ${new Date(event.updated).toLocaleString()}`);
    }
  }

  private displayBasicInfo(event: calendarV3.Schema$Event): void {
    this.log(`Title: ${event.summary || '(No title)'}`);
    this.log(`ID: ${event.id}`);
    
    if (event.description) {
      this.log(`Description: ${event.description}`);
    }
    
    if (event.location) {
      this.log(`Location: ${event.location}`);
    }
    
    if (event.status) {
      this.log(`Status: ${event.status}`);
    }
  }

  private displayEventDetails(event: calendarV3.Schema$Event): void {
    this.log('\n=== Event Details ===\n');
    
    this.displayBasicInfo(event);
    this.displayTimeInfo(event);
    this.displayPeopleInfo(event);
    this.displayAdditionalInfo(event);
    
    this.log('');
  }

  private displayPeopleInfo(event: calendarV3.Schema$Event): void {
    if (event.creator) {
      this.log(`Creator: ${event.creator.displayName || event.creator.email}`);
    }
    
    if (event.organizer) {
      this.log(`Organizer: ${event.organizer.displayName || event.organizer.email}`);
    }
    
    if (event.attendees && event.attendees.length > 0) {
      this.log('\nAttendees:');
      for (const [index, attendee] of event.attendees.entries()) {
        const name = attendee.displayName || attendee.email;
        const status = attendee.responseStatus ? ` (${attendee.responseStatus})` : '';
        this.log(`  ${index + 1}. ${name}${status}`);
      }
    }
  }

  private displayTimeInfo(event: calendarV3.Schema$Event): void {
    if (event.start) {
      const startTime = event.start.dateTime || event.start.date;
      if (startTime) {
        const startDate = new Date(startTime);
        if (event.start.dateTime) {
          this.log(`Start: ${startDate.toLocaleString()}`);
        } else {
          this.log(`Start: ${startDate.toLocaleDateString()} (All day)`);
        }
      }
    }
    
    if (event.end) {
      const endTime = event.end.dateTime || event.end.date;
      if (endTime) {
        const endDate = new Date(endTime);
        if (event.end.dateTime) {
          this.log(`End: ${endDate.toLocaleString()}`);
        } else {
          this.log(`End: ${endDate.toLocaleDateString()} (All day)`);
        }
      }
    }
  }
}