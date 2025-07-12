import type { ICalendarService, IPromptService } from '../interfaces/services';

import { BaseCommand } from '../base-command';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '../constants/languages';
import { TOKENS } from '../di/tokens';

export default class Init extends BaseCommand {
  static description = 'Verify Google Calendar authentication setup';
  static examples = ['<%= config.bin %> <%= command.id %>'];
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

    this.logStatus(this.t('init.messages.status'));

    const confirmed = await this.promptService.confirm(this.t('init.messages.confirm'), true);

    if (confirmed) {
      await this.verifyAuthentication();
    } else {
      this.logResult(this.t('init.messages.cancelled'));
    }
  }

  private async selectLanguage(): Promise<void> {
    const languageOptions = [
      { value: 'en', name: 'English' },
      { value: 'ja', name: '日本語 (Japanese)' },
      { value: 'es', name: 'Español (Spanish)' },
      { value: 'de', name: 'Deutsch (German)' },
      { value: 'pt', name: 'Português (Portuguese)' },
      { value: 'fr', name: 'Français (French)' },
      { value: 'ko', name: '한국어 (Korean)' },
    ].filter((option) => SUPPORTED_LANGUAGES.includes(option.value as SupportedLanguage));

    const selectedLanguage = await this.promptService.select('Select your preferred language:', languageOptions);

    await this.i18nService.changeLanguage(selectedLanguage);
    await this.configService.set('language', selectedLanguage);
  }

  private async verifyAuthentication(): Promise<void> {
    try {
      this.logStatus(this.t('init.messages.verifying'));

      // Test authentication by making a simple API call
      await this.calendarService.listCalendars();

      this.logResult(this.t('init.messages.success'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logResult(this.t('init.messages.authenticationFailed', { error: errorMessage }));
    }
  }
}
