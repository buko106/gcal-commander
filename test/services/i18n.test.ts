import { expect } from 'chai';

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
  });

  describe('#getAvailableLanguages', () => {
    it('should return supported languages array', () => {
      const languages = i18nService.getAvailableLanguages();
      expect(languages).to.be.an('array');
      expect(languages).to.include('en');
      expect(languages).to.include('ja');
    });
  });

  describe('i18next integration', () => {
    it('should translate keys using actual translation files', async () => {
      await i18nService.init();
      
      const translation = i18nService.t('common:loading');
      expect(translation).to.equal('Loading...');
    });

    it('should support language switching', async () => {
      await i18nService.init();
      
      // Default should be English
      expect(i18nService.t('common:yes')).to.equal('Yes');
      
      // Switch to Japanese
      await i18nService.changeLanguage('ja');
      expect(i18nService.t('common:yes')).to.equal('はい');
    });

    it('should translate commands namespace keys', async () => {
      await i18nService.init();
      
      const statusResult = i18nService.t('commands:init.messages.status');
      const confirmResult = i18nService.t('commands:init.messages.confirm');
      
      expect(statusResult).to.equal('This will verify your Google Calendar authentication.');
      expect(confirmResult).to.equal('Do you want to verify authentication?');
    });

    it('should translate commands to Japanese', async () => {
      await i18nService.init();
      await i18nService.changeLanguage('ja');
      
      const statusResult = i18nService.t('commands:init.messages.status');
      const confirmResult = i18nService.t('commands:init.messages.confirm');
      
      expect(statusResult).to.equal('Google Calendar の認証を確認します。');
      expect(confirmResult).to.equal('認証を確認しますか？');
    });
  });
});