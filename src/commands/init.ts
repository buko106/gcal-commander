import type { IPromptService } from '../interfaces/services';

import { BaseCommand } from '../base-command';
import { TOKENS } from '../di/tokens';

export default class Init extends BaseCommand {
  static description = 'Initialize the application';
  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ];
  private promptService!: IPromptService;

  async init(): Promise<void> {
    await super.init();
    this.promptService = this.getContainer().resolve<IPromptService>(TOKENS.PromptService);
  }

  public async run(): Promise<void> {
    this.logStatus('Do you want to continue?');
    
    const confirmed = await this.promptService.confirm('Do you want to continue?', true);
    
    if (confirmed) {
      this.logResult('Input confirmed successfully!');
    } else {
      this.logResult('Operation cancelled.');
    }
  }
}