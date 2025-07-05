import { homedir } from 'node:os';
import { join } from 'node:path';

/**
 * Centralized path management for gcal-commander application files
 */
export class AppPaths {
  private static readonly APP_DIR = AppPaths.getValidatedAppDir();

  /**
   * Get the application directory path
   */
  static getAppDir(): string {
    return this.APP_DIR;
  }

  /**
   * Get the path to the application configuration file
   */
  static getConfigPath(): string {
    return join(this.APP_DIR, 'config.json');
  }

  /**
   * Get the path to the Google OAuth credentials file
   */
  static getCredentialsPath(): string {
    return join(this.APP_DIR, 'credentials.json');
  }

  /**
   * Get the path to the Google OAuth token file
   */
  static getTokenPath(): string {
    return join(this.APP_DIR, 'token.json');
  }

  /**
   * Get and validate the application directory path
   */
  private static getValidatedAppDir(): string {
    const home = homedir();

    if (!home || typeof home !== 'string') {
      throw new Error('Unable to determine home directory');
    }

    return join(home, '.gcal-commander');
  }
}
