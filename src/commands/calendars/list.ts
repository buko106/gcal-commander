import { Command, Flags } from '@oclif/core';
import { calendar_v3 as calendarV3 } from 'googleapis';

import { getCalendarAuth } from '../../auth';
import { CalendarService } from '../../services/calendar';

export default class CalendarsList extends Command {
  static description = 'List all available calendars';
static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --format json',
  ];
static flags = {
    format: Flags.string({
      char: 'f',
      default: 'table',
      description: 'Output format',
      options: ['table', 'json'],
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(CalendarsList);

    try {
      this.logToStderr('Authenticating with Google Calendar...');
      const auth = await getCalendarAuth();
      const calendarService = new CalendarService(auth);

      this.logToStderr('Fetching calendars...');
      const calendars = await calendarService.listCalendars();

      if (calendars.length === 0) {
        this.log('No calendars found.');
        return;
      }

      if (flags.format === 'json') {
        this.logJson(calendars);
      } else {
        this.displayCalendarsTable(calendars);
      }
    } catch (error) {
      this.error(`Failed to list calendars: ${error}`);
    }
  }

  private displayCalendarsTable(calendars: calendarV3.Schema$CalendarListEntry[]): void {
    this.log(`\nAvailable Calendars (${calendars.length} found):\n`);
    
    for (const [index, calendar] of calendars.entries()) {
      const summary = calendar.summary || '(No name)';
      const id = calendar.id || '';
      const description = calendar.description || '';
      const accessRole = calendar.accessRole || '';
      const primary = calendar.primary ? ' (Primary)' : '';
      const backgroundColor = calendar.backgroundColor || '';
      
      this.log(`${index + 1}. ${summary}${primary}`);
      this.log(`   ID: ${id}`);
      this.log(`   Access: ${accessRole}`);
      
      if (description) {
        this.log(`   Description: ${description}`);
      }
      
      if (backgroundColor) {
        this.log(`   Color: ${backgroundColor}`);
      }
      
      this.log('');
    }
  }
}