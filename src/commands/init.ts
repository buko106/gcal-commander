import type { ICalendarService, II18nService, IPromptService } from '../interfaces/services';

import { BaseCommand } from '../base-command';
import { TOKENS } from '../di/tokens';

export default class Init extends BaseCommand {
  static description = 'Verify Google Calendar authentication setup';
  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ];
  private i18nService!: II18nService;
  private promptService!: IPromptService;

  async init(): Promise<void> {
    await super.init();
    this.promptService = this.getContainer().resolve<IPromptService>(TOKENS.PromptService);
    this.calendarService = this.getContainer().resolve<ICalendarService>(TOKENS.CalendarService);
    this.i18nService = this.getContainer().resolve<II18nService>(TOKENS.I18nService);
  }

  public async run(): Promise<void> {
    // Language selection first
    await this.selectLanguage();
    
    this.logStatus('This will verify your Google Calendar authentication.');
    
    const confirmed = await this.promptService.confirm('Do you want to verify authentication?', true);
    
    if (confirmed) {
      await this.verifyAuthentication();
    } else {
      this.logResult('Operation cancelled.');
    }
  }

  private async selectLanguage(): Promise<void> {
    // Initialize i18n service first
    await this.i18nService.init();
    
    const selectedLanguage = await this.promptService.select('Select your preferred language:', [
      { value: 'en', name: 'English' },
      { value: 'ja', name: '日本語 (Japanese)' }
    ]);

    await this.i18nService.changeLanguage(selectedLanguage);
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