import { Command, Flags } from '@oclif/core';

export abstract class BaseCommand extends Command {
  static baseFlags = {
    quiet: Flags.boolean({
      char: 'q',
      default: false,
      description: 'Suppress non-essential output (status messages, progress indicators)',
    }),
  };
protected quiet = false;

  async init(): Promise<void> {
    await super.init();
    const { flags } = await this.parse(this.constructor as typeof BaseCommand);
    this.quiet = flags.quiet;
  }

  protected logError(message: string): never {
    this.error(message);
  }

  protected logResult(message: string): void {
    this.log(message);
  }

  protected logStatus(message: string): void {
    if (!this.quiet) {
      this.logToStderr(message);
    }
  }
}