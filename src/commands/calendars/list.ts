// import { Flags } from '@oclif/core';
import { calendar_v3 as calendarV3 } from 'googleapis';

import { BaseCommand } from '../../base-command';
import { TableColumn, TableFormatter } from '../../utils/table-formatter';

export default class CalendarsList extends BaseCommand {
  static description = 'List all available calendars';
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --format json'];
  static flags = {
    ...BaseCommand.baseFlags,
  };

  public async run(): Promise<void> {
    await this.parse(CalendarsList);

    try {
      await this.initI18nService();

      this.logStatus(this.t('calendars.list.authenticating'));
      await this.initCalendarService();

      this.logStatus(this.t('calendars.list.fetching'));
      const calendars = await this.calendarService.listCalendars();

      if (calendars.length === 0) {
        this.logResult(this.t('calendars.list.noCalendarsFound'));
        return;
      }

      if (this.format === 'json' || this.format === 'pretty-json') {
        this.outputJson(calendars);
      } else {
        this.displayCalendarsTable(calendars);
      }
    } catch (error) {
      this.logError(this.t('calendars.list.error', { error: String(error) }));
    }
  }

  private displayCalendarsTable(calendars: calendarV3.Schema$CalendarListEntry[]): void {
    this.logResult(this.t('calendars.list.tableHeader', { count: calendars.length }));

    const columns: TableColumn[] = [
      { key: 'name', label: this.t('calendars.list.columns.name'), width: 25 },
      { key: 'id', label: this.t('calendars.list.columns.id'), width: 35 },
      { key: 'access', label: this.t('calendars.list.columns.access'), width: 15 },
      { key: 'primary', label: this.t('calendars.list.columns.primary'), width: 10 },
      { key: 'description', label: this.t('calendars.list.columns.description'), width: 30 },
      { key: 'color', label: this.t('calendars.list.columns.color'), width: 15 },
    ];

    const formatter = new TableFormatter({
      columns,
      fields: this.fields,
    });

    const tableData = calendars.map((calendar) => ({
      name: calendar.summary || this.t('calendars.list.noName'),
      id: calendar.id || '',
      access: calendar.accessRole || '',
      primary: calendar.primary ? this.t('calendars.list.labels.primary') : '',
      description: calendar.description
        ? calendar.description.length > 40
          ? calendar.description.slice(0, 40) + '...'
          : calendar.description
        : '',
      color: calendar.backgroundColor || '',
    }));

    const table = formatter.format(tableData);
    this.logResult(table);
  }
}
