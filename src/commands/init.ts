import type { ICalendarService, IPromptService } from '../interfaces/services';

import { BaseCommand } from '../base-command';
import { TOKENS } from '../di/tokens';

export default class Init extends BaseCommand {
  static description = 'Verify Google Calendar authentication setup';
  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ];
  private promptService!: IPromptService;

  async init(): Promise<void> {
    await super.init();
    this.promptService = this.getContainer().resolve<IPromptService>(TOKENS.PromptService);
    this.calendarService = this.getContainer().resolve<ICalendarService>(TOKENS.CalendarService);
  }

  public async run(): Promise<void> {
    this.logStatus('This will verify your Google Calendar authentication.');
    
    const confirmed = await this.promptService.confirm('Do you want to verify authentication?', true);
    
    if (confirmed) {
      await this.verifyAuthentication();
    } else {
      this.logResult('Operation cancelled.');
    }
  }

  private async verifyAuthentication(): Promise<void> {
    try {
      this.logStatus('Verifying Google Calendar authentication...');
      
      // Test authentication by making a simple API call
      await this.calendarService.listCalendars();
      
      this.logResult('Authentication successful!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logResult(`Authentication failed: ${errorMessage}\nTry running the command again or check your Google Calendar API credentials.`);
    }
  }
}