import { Args, Command, Flags } from '@oclif/core';
import { calendar_v3 as calendarV3 } from 'googleapis';

import { getCalendarAuth } from '../../auth';
import { CalendarService } from '../../services/calendar';

export default class EventsList extends Command {
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
      this.log('Authenticating with Google Calendar...');
      const auth = await getCalendarAuth();
      const calendarService = new CalendarService(auth);

      const timeMin = new Date().toISOString();
      const timeMax = new Date(Date.now() + flags.days * 24 * 60 * 60 * 1000).toISOString();

      this.log(`Fetching events from ${args.calendar}...`);
      const events = await calendarService.listEvents({
        calendarId: args.calendar,
        maxResults: flags['max-results'],
        timeMax,
        timeMin,
      });

      if (events.length === 0) {
        this.log('No upcoming events found.');
        return;
      }

      if (flags.format === 'json') {
        this.log(JSON.stringify(events, null, 2));
      } else {
        this.displayEventsTable(events);
      }
    } catch (error) {
      this.error(`Failed to list events: ${error}`);
    }
  }

  private displayEventsTable(events: calendarV3.Schema$Event[]): void {
    this.log(`\nUpcoming Events (${events.length} found):\n`);
    
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
        
        this.log(`${index + 1}. ${summary}`);
        this.log(`   ${dateStr} • ${timeStr}${location}`);
        if (event.description) {
          const description = event.description.length > 100 
            ? event.description.slice(0, 100) + '...'
            : event.description;
          this.log(`   ${description}`);
        }

        this.log('');
      }
    }
  }
}