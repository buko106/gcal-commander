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
    // Initialize i18n service first
    await this.initI18nService();
    
    // Language selection first
    await this.selectLanguage();
    
    this.logStatus(this.t('commands:init.messages.status'));
    
    const confirmed = await this.promptService.confirm(this.t('commands:init.messages.confirm'), true);
    
    if (confirmed) {
      await this.verifyAuthentication();
    } else {
      this.logResult(this.t('commands:init.messages.cancelled'));
    }
  }

  private async selectLanguage(): Promise<void> {
    const selectedLanguage = await this.promptService.select('Select your preferred language:', [
      { value: 'en', name: 'English' },
      { value: 'ja', name: '日本語 (Japanese)' }
    ]);

    await this.i18nService.changeLanguage(selectedLanguage);
    await this.configService.set('language', selectedLanguage);
  }

  private async verifyAuthentication(): Promise<void> {
    try {
      this.logStatus(this.t('commands:init.messages.verifying'));
      
      // Test authentication by making a simple API call
      await this.calendarService.listCalendars();
      
      this.logResult(this.t('commands:init.messages.success'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logResult(`Authentication failed: ${errorMessage}\nTry running the command again or check your Google Calendar API credentials.`);
    }
  }
}