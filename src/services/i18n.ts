import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'node:path';

import { II18nService } from '../interfaces/services';

export class I18nService implements II18nService {
  private initialized = false;

  async changeLanguage(language: string): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }

    await i18next.changeLanguage(language);
  }

  getAvailableLanguages(): string[] {
    // Return supported languages as per design doc
    return ['en', 'ja'];
  }

  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // eslint-disable-next-line unicorn/prefer-module
    const localesPath = path.join(__dirname, '../locales');
    
    await i18next
      .use(Backend)
      .init({
        lng: 'en', // Default language
        fallbackLng: 'en',
        backend: {
          loadPath: path.join(localesPath, '{{lng}}/{{ns}}.json'),
        },
        ns: ['common', 'commands'], // Available namespaces
        defaultNS: 'commands',
        interpolation: {
          escapeValue: false, // React already escapes values
        },
      });

    this.initialized = true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t(key: string, options?: any): string {
    if (!this.initialized) {
      return key; // Return key if not initialized
    }

    const result = i18next.t(key, options);
    return typeof result === 'string' ? result : key;
  }
}