import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { TOKENS } from '../../src/di/tokens';
import { I18nService } from '../../src/services/i18n';
import { TestContainerFactory } from '../../src/test-utils/mock-factories/test-container-factory';

describe('config i18n integration', () => {
  describe('English translation (default)', () => {
    beforeEach(() => {
      const { mocks } = TestContainerFactory.create();
      const realI18nService = new I18nService();
      TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
      
      // Mock config storage methods (ConfigService uses ConfigStorage)
      mocks.configStorage.read.resolves('{}');
      mocks.configStorage.exists.resolves(false);
      mocks.configStorage.getConfigPath.returns('/mock/path/config.json');
    });

    afterEach(() => {
      TestContainerFactory.cleanup();
    });

    it('should display config list messages in English', async () => {
      const { stderr, stdout } = await runCommand(['config', 'list']);
      
      expect(stderr).to.include('Current configuration:');
      expect(stderr).to.include('Config file: /mock/path/config.json');
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
      mocks.configStorage.getConfigPath.returns('/mock/path/config.json');
    });

    afterEach(() => {
      TestContainerFactory.cleanup();
    });

    it('should display config list messages in Japanese', async () => {
      const { stderr, stdout } = await runCommand(['config', 'list']);
      
      expect(stderr).to.include('現在の設定:');
      expect(stderr).to.include('設定ファイル: /mock/path/config.json');
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
  });
});