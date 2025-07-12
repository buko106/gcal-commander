import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { TOKENS } from '../../src/di/tokens';
import { I18nService } from '../../src/services/i18n';
import { TestContainerFactory } from '../test-utils/mock-factories';

describe('config i18n integration', () => {
  describe('English translation (default)', () => {
    beforeEach(() => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      // Mock config storage methods (ConfigService uses ConfigStorage)
      mocks.configStorage.read.resolves('{}');
      mocks.configStorage.exists.resolves(false);
    });

    afterEach(() => {
      TestContainerFactory.cleanup();
    });

    it('should display config list messages in English', async () => {
      const { stderr, stdout } = await runCommand(['config', 'list']);

      expect(stderr).to.include('Current configuration:');
      expect(stderr).to.include('Config file: in-memory');
      expect(stdout).to.include('No configuration set');
    });

    it('should display config get messages in English for unset key', async () => {
      const { stdout } = await runCommand(['config', 'get', 'defaultCalendar']);

      expect(stdout).to.include("Configuration key 'defaultCalendar' is not set");
    });

    it('should display config set success message in English', async () => {
      const { stdout } = await runCommand(['config', 'set', 'defaultCalendar', 'test@example.com']);

      expect(stdout).to.include('Set defaultCalendar = "test@example.com"');
    });

    it('should display config unset messages in English', async () => {
      const { stdout } = await runCommand(['config', 'unset', 'defaultCalendar']);

      expect(stdout).to.include("Configuration key 'defaultCalendar' is not set");
    });

    it('should display config reset confirmation message in English', async () => {
      const { stdout } = await runCommand(['config', 'reset']);

      expect(stdout).to.include('This will reset all configuration settings.');
      expect(stdout).to.include('Use --confirm flag to proceed: gcal config reset --confirm');
    });

    it('should display config set validation error in English', async () => {
      const result = await runCommand(['config', 'set']);

      expect(result.error).to.exist;
      expect(result.error?.message).to.include('Key and value are required for set command');
      expect(result.error?.message).to.include('Usage: gcal config set <key> <value>');
    });

    it('should display invalid number value error in English', async () => {
      const result = await runCommand(['config', 'set', 'events.maxResults', 'not-a-number']);

      expect(result.error).to.exist;
      expect(result.error?.message).to.include('Invalid number value for events.maxResults: not-a-number');
    });

    it('should display invalid configuration key error in English', async () => {
      const result = await runCommand(['config', 'get', 'invalid.key']);

      expect(result.error).to.exist;
      expect(result.error?.message).to.include('Invalid configuration key: invalid.key');
      expect(result.error?.message).to.include('Valid keys:');
    });

    it('should display missing key parameter error in English', async () => {
      const result = await runCommand(['config', 'get']);

      expect(result.error).to.exist;
      expect(result.error?.message).to.include('Key is required for get command');
      expect(result.error?.message).to.include('Usage: gcal config get <key>');
    });
  });

  describe('Japanese translation', () => {
    beforeEach(async () => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      await realI18nService.init();
      await realI18nService.changeLanguage('ja');
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      // Mock config storage methods (ConfigService uses ConfigStorage)
      mocks.configStorage.read.resolves('{}');
      mocks.configStorage.exists.resolves(false);
    });

    afterEach(() => {
      TestContainerFactory.cleanup();
    });

    it('should display config list messages in Japanese', async () => {
      const { stderr, stdout } = await runCommand(['config', 'list']);

      expect(stderr).to.include('現在の設定:');
      expect(stderr).to.include('設定ファイル: in-memory');
      expect(stdout).to.include('設定がありません');
    });

    it('should display config get messages in Japanese for unset key', async () => {
      const { stdout } = await runCommand(['config', 'get', 'defaultCalendar']);

      expect(stdout).to.include("設定キー 'defaultCalendar' は設定されていません");
    });

    it('should display config set success message in Japanese', async () => {
      const { stdout } = await runCommand(['config', 'set', 'defaultCalendar', 'test@example.com']);

      expect(stdout).to.include('defaultCalendar = "test@example.com" に設定しました');
    });

    it('should display config unset messages in Japanese', async () => {
      const { stdout } = await runCommand(['config', 'unset', 'defaultCalendar']);

      expect(stdout).to.include("設定キー 'defaultCalendar' は設定されていません");
    });

    it('should display config reset confirmation message in Japanese', async () => {
      const { stdout } = await runCommand(['config', 'reset']);

      expect(stdout).to.include('すべての設定をリセットします。');
      expect(stdout).to.include('実行するには --confirm フラグを使用してください: gcal config reset --confirm');
    });

    it('should display config set validation error in Japanese', async () => {
      const result = await runCommand(['config', 'set']);

      expect(result.error).to.exist;
      expect(result.error?.message).to.include('キーと値は set コマンドで必須です');
      expect(result.error?.message).to.include('使用方法: gcal config set <key> <value>');
    });

    it('should display invalid number value error in Japanese', async () => {
      const result = await runCommand(['config', 'set', 'events.maxResults', 'not-a-number']);

      expect(result.error).to.exist;
      expect(result.error?.message).to.include('events.maxResults の数値が無効です: not-a-number');
    });

    it('should display invalid configuration key error in Japanese', async () => {
      const result = await runCommand(['config', 'get', 'invalid.key']);

      expect(result.error).to.exist;
      expect(result.error?.message).to.include('無効な設定キー: invalid.key');
      expect(result.error?.message).to.include('有効なキー:');
    });

    it('should display missing key parameter error in Japanese', async () => {
      const result = await runCommand(['config', 'get']);

      expect(result.error).to.exist;
      expect(result.error?.message).to.include('get コマンドにはキーが必要です');
      expect(result.error?.message).to.include('使用方法: gcal config get <key>');
    });
  });

  describe('language setting behavior', () => {
    beforeEach(() => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);

      // Mock config storage methods
      mocks.configStorage.read.resolves('{}');
      mocks.configStorage.exists.resolves(false);
    });

    afterEach(() => {
      TestContainerFactory.cleanup();
    });

    it('should switch language immediately when setting language to Japanese', async () => {
      const { stdout } = await runCommand(['config', 'set', 'language', 'ja']);

      expect(stdout).to.include('language = "ja" に設定しました');
    });

    it('should switch language immediately when setting language to English', async () => {
      const { stdout } = await runCommand(['config', 'set', 'language', 'en']);

      expect(stdout).to.include('Set language = "en"');
    });

    it('should switch language immediately when setting language to Korean', async () => {
      const { stdout } = await runCommand(['config', 'set', 'language', 'ko']);

      expect(stdout).to.include('language = "ko" 설정');
    });
  });
});
