import { beforeEach, describe, expect, it } from 'vitest';

import { SUPPORTED_LANGUAGES } from '../../src/constants/languages';
import { I18nService } from '../../src/services/i18n';

describe('I18nService', () => {
  let i18nService: I18nService;

  beforeEach(() => {
    i18nService = new I18nService();
  });

  describe('#init', () => {
    it('should initialize without error', async () => {
      await i18nService.init();
      // Test passes if no error is thrown
    });

    it('should initialize with specified language', async () => {
      await i18nService.init('ja');

      // Should start with Japanese language
      const translation = i18nService.t('common:yes');
      expect(translation).toBe('はい');
    });

    it('should default to English if no language specified', async () => {
      await i18nService.init();

      // Should start with English language
      const translation = i18nService.t('common:yes');
      expect(translation).toBe('Yes');
    });
  });

  describe('supported languages constant', () => {
    it('should have all supported languages in constant', () => {
      expect(SUPPORTED_LANGUAGES).toBeTypeOf('object');
      expect(SUPPORTED_LANGUAGES).toContain('de');
      expect(SUPPORTED_LANGUAGES).toContain('en');
      expect(SUPPORTED_LANGUAGES).toContain('es');
      expect(SUPPORTED_LANGUAGES).toContain('fr');
      expect(SUPPORTED_LANGUAGES).toContain('ja');
      expect(SUPPORTED_LANGUAGES).toContain('ko');
      expect(SUPPORTED_LANGUAGES).toContain('pt');
    });

    it('should have exactly 7 supported languages', () => {
      expect(SUPPORTED_LANGUAGES).toHaveLength(7);
    });
  });

  describe('i18next integration', () => {
    it('should translate keys using actual translation files', async () => {
      await i18nService.init();

      const translation = i18nService.t('common:loading');
      expect(translation).toBe('Loading...');
    });

    it('should support language switching', async () => {
      await i18nService.init();

      // Default should be English
      expect(i18nService.t('common:yes')).toBe('Yes');

      // Switch to Japanese
      await i18nService.changeLanguage('ja');
      expect(i18nService.t('common:yes')).toBe('はい');
    });

    it('should translate commands namespace keys', async () => {
      await i18nService.init();

      const statusResult = i18nService.t('commands:init.messages.status');
      const confirmResult = i18nService.t('commands:init.messages.confirm');

      expect(statusResult).toBe('This will verify your Google Calendar authentication.');
      expect(confirmResult).toBe('Do you want to verify authentication?');
    });

    it('should translate commands to Japanese', async () => {
      await i18nService.init();
      await i18nService.changeLanguage('ja');

      const statusResult = i18nService.t('commands:init.messages.status');
      const confirmResult = i18nService.t('commands:init.messages.confirm');

      expect(statusResult).toBe('Google Calendar の認証を確認します。');
      expect(confirmResult).toBe('認証を確認しますか？');
    });

    it('should translate to Spanish', async () => {
      await i18nService.init();
      await i18nService.changeLanguage('es');

      const yesResult = i18nService.t('common:yes');
      const noResult = i18nService.t('common:no');

      expect(yesResult).toBe('Sí');
      expect(noResult).toBe('No');
    });

    it('should translate to German', async () => {
      await i18nService.init();
      await i18nService.changeLanguage('de');

      const yesResult = i18nService.t('common:yes');
      const loadingResult = i18nService.t('common:loading');

      expect(yesResult).toBe('Ja');
      expect(loadingResult).toBe('Lädt...');
    });

    it('should translate to Portuguese', async () => {
      await i18nService.init();
      await i18nService.changeLanguage('pt');

      const yesResult = i18nService.t('common:yes');
      const cancelResult = i18nService.t('common:cancel');

      expect(yesResult).toBe('Sim');
      expect(cancelResult).toBe('Cancelar');
    });

    it('should translate to French', async () => {
      await i18nService.init();
      await i18nService.changeLanguage('fr');

      const yesResult = i18nService.t('common:yes');
      const loadingResult = i18nService.t('common:loading');

      expect(yesResult).toBe('Oui');
      expect(loadingResult).toBe('Chargement...');
    });

    it('should translate to Korean', async () => {
      await i18nService.init();
      await i18nService.changeLanguage('ko');

      const yesResult = i18nService.t('common:yes');
      const noResult = i18nService.t('common:no');

      expect(yesResult).toBe('예');
      expect(noResult).toBe('아니오');
    });
  });
});
