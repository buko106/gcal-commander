import { Args, Flags } from '@oclif/core';
import { calendar_v3 as calendarV3 } from 'googleapis';

import { BaseCommand, OutputFormat } from '../../base-command';
import { DateFormatter } from '../../utils/date-formatter';
import { TableColumn, TableFormatter } from '../../utils/table-formatter';

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
    'max-results': Flags.integer({
      char: 'n',
      default: 10,
      description: 'Maximum number of events to return',
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(EventsList);

    try {
      await this.initI18nService();
      this.logStatus(this.t('events.list.authenticating'));
      await this.initCalendarService();

      // Get configuration values
      // Determine calendar to use: explicit CLI arg > config > default 'primary'
      const defaultCalendar = await this.configService.get<string>('defaultCalendar');
      const calendarId = args.calendar === 'primary' ? defaultCalendar || 'primary' : args.calendar;

      // Apply config defaults for other settings
      const configMaxResults = (await this.configService.get<number>('events.maxResults')) || 10;
      const configDays = (await this.configService.get<number>('events.days')) || 30;
      const configFormat = (await this.configService.get<OutputFormat>('events.format')) || 'table';

      const maxResults = flags['max-results'] || configMaxResults;
      const days = flags.days || configDays;
      const format = this.format === 'table' ? configFormat : this.format;

      const timeMin = new Date().toISOString();
      const timeMax = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

      this.logStatus(this.t('events.list.fetching', { calendarId }));
      const events = await this.calendarService.listEvents({
        calendarId,
        maxResults,
        timeMax,
        timeMin,
      });

      if (events.length === 0) {
        this.logResult(this.t('events.list.noEventsFound'));
        return;
      }

      if (format === 'json' || format === 'pretty-json') {
        this.outputJson(events);
      } else {
        this.displayEventsTable(events);
      }
    } catch (error) {
      this.logError(this.t('events.list.error', { error: String(error) }));
    }
  }

  private displayEventsTable(events: calendarV3.Schema$Event[]): void {
    this.logResult(this.t('events.list.tableHeader', { count: events.length }));

    const columns: TableColumn[] = [
      { key: 'title', label: this.t('events.list.columns.title'), width: 30 },
      { key: 'date', label: this.t('events.list.columns.date'), width: 15 },
      { key: 'time', label: this.t('events.list.columns.time'), width: 15 },
      { key: 'location', label: this.t('events.list.columns.location'), width: 20 },
      { key: 'description', label: this.t('events.list.columns.description'), width: 30 },
    ];

    const formatter = new TableFormatter({
      columns,
      fields: this.fields,
    });

    const tableData = events.map((event) => {
      const timeInfo = DateFormatter.formatListEventTime(event);
      return {
        title: event.summary || this.t('events.list.noTitle'),
        date: timeInfo?.dateStr || '',
        time: timeInfo?.timeStr || '',
        location: event.location || '',
        description: event.description || '',
      };
    });

    const table = formatter.format(tableData);
    this.logResult(table);
  }
}
