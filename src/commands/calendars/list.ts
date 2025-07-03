// import { Flags } from '@oclif/core';
import { calendar_v3 as calendarV3 } from 'googleapis';

import { BaseCommand } from '../../base-command';

export default class CalendarsList extends BaseCommand {
  static description = 'List all available calendars';
static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --format json',
  ];
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
    
    for (const [index, calendar] of calendars.entries()) {
      const summary = calendar.summary || this.t('calendars.list.noName');
      const id = calendar.id || '';
      const description = calendar.description || '';
      const accessRole = calendar.accessRole || '';
      const primary = calendar.primary ? ' (Primary)' : '';
      const backgroundColor = calendar.backgroundColor || '';
      
      this.logResult(`${index + 1}. ${summary}${primary}`);
      this.logResult(`   ID: ${id}`);
      this.logResult(`   Access: ${accessRole}`);
      
      if (description) {
        this.logResult(`   Description: ${description}`);
      }
      
      if (backgroundColor) {
        this.logResult(`   Color: ${backgroundColor}`);
      }
      
      this.logResult('');
    }
  }
}