import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'node:path';

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../constants/languages';
import { II18nService } from '../interfaces/services';

export class I18nService implements II18nService {
  private initialized = false;

  async changeLanguage(language: string): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }

    await i18next.changeLanguage(language);
  }

  async init(language?: string): Promise<void> {
    if (this.initialized) {
      // If language is specified and different from current, change language
      if (language && i18next.language !== language) {
        await i18next.changeLanguage(language);
      }

      return;
    }

    // eslint-disable-next-line unicorn/prefer-module
    const localesPath = path.join(__dirname, '../locales');
    const loadPath = path.join(localesPath, '{{lng}}/{{ns}}.json');

    await i18next.use(Backend).init({
      lng: language || DEFAULT_LANGUAGE, // Use provided language or default to English
      fallbackLng: DEFAULT_LANGUAGE,
      preload: [...SUPPORTED_LANGUAGES], // Preload all supported languages
      backend: {
        loadPath,
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
      throw new Error(`I18n service not initialized. Cannot translate key: ${key}`);
    }

    const result = i18next.t(key, options);
    return result as string;
  }
}
