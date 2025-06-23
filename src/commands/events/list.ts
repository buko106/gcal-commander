import { Args, Flags } from '@oclif/core';
import { calendar_v3 as calendarV3 } from 'googleapis';

import { BaseCommand } from '../../base-command';
import { ConfigService } from '../../services/config';

export default class EventsList extends BaseCommand {
  static args = {
    calendar: Args.string({
      default: 'primary',
      description: 'Calendar ID to list events from',
    }),
  };
static description = 'List upcoming calendar events';
static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> my-calendar@gmail.com',
    '<%= config.bin %> <%= command.id %> --max-results 20',
    '<%= config.bin %> <%= command.id %> --days 7',
  ];
static flags = {
    ...BaseCommand.baseFlags,
    days: Flags.integer({
      char: 'd',
      default: 30,
      description: 'Number of days to look ahead',
    }),
    format: Flags.string({
      char: 'f',
      default: 'table',
      description: 'Output format',
      options: ['table', 'json'],
    }),
    'max-results': Flags.integer({
      char: 'n',
      default: 10,
      description: 'Maximum number of events to return',
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(EventsList);

    try {
      this.logStatus('Authenticating with Google Calendar...');
      await this.initCalendarService();

      // Get configuration values
      const configService = ConfigService.getInstance();
      
      // Determine calendar to use: explicit CLI arg > config > default 'primary'
      const defaultCalendar = await configService.get<string>('defaultCalendar');
      const calendarId = args.calendar === 'primary' ? (defaultCalendar || 'primary') : args.calendar;
      
      // Apply config defaults for other settings
      const configMaxResults = await configService.get<number>('events.maxResults') || 10;
      const configDays = await configService.get<number>('events.days') || 30;
      const configFormat = await configService.get<'json' | 'table'>('events.format') || 'table';
      
      const maxResults = flags['max-results'] || configMaxResults;
      const days = flags.days || configDays;
      const format = flags.format || configFormat;

      const timeMin = new Date().toISOString();
      const timeMax = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

      this.logStatus(`Fetching events from ${calendarId}...`);
      const events = await this.calendarService.listEvents({
        calendarId,
        maxResults,
        timeMax,
        timeMin,
      });

      if (events.length === 0) {
        this.logResult('No upcoming events found.');
        return;
      }

      if (format === 'json') {
        this.logJson(events);
      } else {
        this.displayEventsTable(events);
      }
    } catch (error) {
      this.logError(`Failed to list events: ${error}`);
    }
  }

  private displayEventsTable(events: calendarV3.Schema$Event[]): void {
    this.logResult(`\nUpcoming Events (${events.length} found):\n`);
    
    for (const [index, event] of events.entries()) {
      const start = event.start?.dateTime || event.start?.date;
      const startDate = start ? new Date(start) : null;
      const summary = event.summary || '(No title)';
      const location = event.location ? ` @ ${event.location}` : '';
      
      if (startDate) {
        const dateStr = startDate.toLocaleDateString();
        const timeStr = event.start?.dateTime 
          ? startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : 'All day';
        
        this.logResult(`${index + 1}. ${summary}`);
        this.logResult(`   ${dateStr} • ${timeStr}${location}`);
        if (event.description) {
          const description = event.description.length > 100 
            ? event.description.slice(0, 100) + '...'
            : event.description;
          this.logResult(`   ${description}`);
        }

        this.logResult('');
      }
    }
  }
}