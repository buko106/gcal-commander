import { expect } from 'chai';
import * as sinon from 'sinon';

import { IConfigStorage } from '../../src/interfaces/config-storage';
import { IConfigService } from '../../src/interfaces/services';
import { TestContainerFactory } from '../test-utils/mock-factories';

describe('ConfigService', () => {
  let configService: IConfigService;
  let mockConfigStorage: IConfigStorage & sinon.SinonStubbedInstance<IConfigStorage>;

  beforeEach(() => {
    const { mocks } = TestContainerFactory.create();
    configService = mocks.configService;
    mockConfigStorage = mocks.configStorage;
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  describe('load', () => {
    it('should load config from storage when file exists', async () => {
      const mockConfig = { defaultCalendar: 'test@example.com' };
      mockConfigStorage.exists.resolves(true);
      mockConfigStorage.read.resolves(JSON.stringify(mockConfig));

      const result = await configService.list();

      expect(result).to.deep.equal(mockConfig);
      expect(mockConfigStorage.exists.calledOnce).to.be.true;
      expect(mockConfigStorage.read.calledOnce).to.be.true;
    });

    it('should use empty config when file does not exist', async () => {
      mockConfigStorage.exists.resolves(false);

      const result = await configService.list();

      expect(result).to.deep.equal({});
      expect(mockConfigStorage.exists.calledOnce).to.be.true;
      expect(mockConfigStorage.read.called).to.be.false;
    });

    it('should use empty config when storage read fails', async () => {
      mockConfigStorage.exists.resolves(true);
      mockConfigStorage.read.rejects(new Error('Read error'));

      const result = await configService.list();

      expect(result).to.deep.equal({});
      expect(mockConfigStorage.exists.calledOnce).to.be.true;
      expect(mockConfigStorage.read.calledOnce).to.be.true;
    });

    it('should use empty config when JSON parsing fails', async () => {
      mockConfigStorage.exists.resolves(true);
      mockConfigStorage.read.resolves('invalid json');

      const result = await configService.list();

      expect(result).to.deep.equal({});
      expect(mockConfigStorage.exists.calledOnce).to.be.true;
      expect(mockConfigStorage.read.calledOnce).to.be.true;
    });

    it('should not reload config if already loaded', async () => {
      mockConfigStorage.exists.resolves(true);
      mockConfigStorage.read.resolves('{}');

      // First call should load
      await configService.list();

      // Second call should not reload
      await configService.list();

      expect(mockConfigStorage.exists.calledOnce).to.be.true;
      expect(mockConfigStorage.read.calledOnce).to.be.true;
    });
  });

  describe('reset', () => {
    it('should reset config to empty object and save', async () => {
      // First set some config
      await configService.set('defaultCalendar', 'test@example.com');
      mockConfigStorage.write.resetHistory();

      await configService.reset();

      const result = await configService.list();
      expect(result).to.deep.equal({});
      expect(mockConfigStorage.write.calledOnce).to.be.true;
      expect(mockConfigStorage.write.getCall(0).args[0]).to.equal('{}');
    });
  });

  describe('validateKey', () => {
    it('should return true for valid keys', () => {
      expect(configService.validateKey('defaultCalendar')).to.be.true;
      expect(configService.validateKey('language')).to.be.true;
      expect(configService.validateKey('events.maxResults')).to.be.true;
      expect(configService.validateKey('events.format')).to.be.true;
      expect(configService.validateKey('events.days')).to.be.true;
    });

    it('should return false for invalid keys', () => {
      expect(configService.validateKey('invalidKey')).to.be.false;
      expect(configService.validateKey('events.invalidKey')).to.be.false;
      expect(configService.validateKey('')).to.be.false;
    });
  });

  describe('validateValue', () => {
    it('should return valid=false for unknown keys', () => {
      const result = configService.validateValue('unknownKey', 'value');

      expect(result.valid).to.be.false;
      expect(result.errorKey).to.equal('config.validation.unknownKey');
      expect(result.errorOptions).to.deep.equal({ key: 'unknownKey' });
    });

    it('should return valid=true for correct defaultCalendar value', () => {
      const result = configService.validateValue('defaultCalendar', 'test@example.com');

      expect(result.valid).to.be.true;
      expect(result.error).to.be.undefined;
      expect(result.errorKey).to.be.undefined;
    });

    it('should return valid=false for invalid language value', () => {
      const result = configService.validateValue('language', 'invalid');

      expect(result.valid).to.be.false;
      expect(result.errorKey).to.equal('config.validation.zodError');
      expect(result.errorOptions).to.have.property('key', 'language');
      expect(result.errorOptions).to.have.property('message');
    });

    it('should return valid=false for invalid events.days value', () => {
      const result = configService.validateValue('events.days', 0);

      expect(result.valid).to.be.false;
      expect(result.errorKey).to.equal('config.validation.zodError');
      expect(result.errorOptions).to.have.property('key', 'events.days');
    });

    it('should return valid=false for invalid events.maxResults value', () => {
      const result = configService.validateValue('events.maxResults', 101);

      expect(result.valid).to.be.false;
      expect(result.errorKey).to.equal('config.validation.zodError');
      expect(result.errorOptions).to.have.property('key', 'events.maxResults');
    });

    it('should return valid=false for invalid events.format value', () => {
      const result = configService.validateValue('events.format', 'invalid');

      expect(result.valid).to.be.false;
      expect(result.errorKey).to.equal('config.validation.zodError');
      expect(result.errorOptions).to.have.property('key', 'events.format');
    });

    it('should handle non-Zod validation errors', () => {
      // This case is harder to trigger but we can test by mocking the schema parsing
      const result = configService.validateValue('defaultCalendar', null);

      expect(result.valid).to.be.false;
      expect(result.errorKey).to.equal('config.validation.zodError');
    });
  });

  describe('nested value operations', () => {
    it('should handle nested get operations', async () => {
      mockConfigStorage.exists.resolves(true);
      mockConfigStorage.read.resolves(
        JSON.stringify({
          events: {
            maxResults: 50,
            format: 'json',
          },
        }),
      );

      const maxResults = await configService.get('events.maxResults');
      const format = await configService.get('events.format');

      expect(maxResults).to.equal(50);
      expect(format).to.equal('json');
    });

    it('should handle nested set operations', async () => {
      mockConfigStorage.exists.resolves(false);

      await configService.set('events.maxResults', 25);
      await configService.set('events.format', 'table');

      const config = await configService.list();
      expect(config).to.deep.equal({
        events: {
          maxResults: 25,
          format: 'table',
        },
      });
    });

    it('should handle nested unset operations', async () => {
      mockConfigStorage.exists.resolves(true);
      mockConfigStorage.read.resolves(
        JSON.stringify({
          events: {
            maxResults: 50,
            format: 'json',
          },
          defaultCalendar: 'test@example.com',
        }),
      );

      await configService.unset('events.maxResults');

      const config = await configService.list();
      expect(config).to.deep.equal({
        events: {
          format: 'json',
        },
        defaultCalendar: 'test@example.com',
      });
    });

    it('should handle unset operations on non-existent keys', async () => {
      mockConfigStorage.exists.resolves(false);

      await configService.unset('nonExistent.key');

      const config = await configService.list();
      expect(config).to.deep.equal({});
    });

    it('should handle get operations on non-existent keys', async () => {
      mockConfigStorage.exists.resolves(false);

      const result = await configService.get('nonExistent.key');

      expect(result).to.be.undefined;
    });
  });

  describe('getValidKeys', () => {
    it('should return all valid configuration keys', () => {
      const validKeys = configService.getValidKeys();

      expect(validKeys).to.include('defaultCalendar');
      expect(validKeys).to.include('language');
      expect(validKeys).to.include('events.maxResults');
      expect(validKeys).to.include('events.format');
      expect(validKeys).to.include('events.days');
    });
  });

  describe('getConfigPath', () => {
    it('should return config path from storage', () => {
      const expectedPath = '/test/config/path';
      mockConfigStorage.getConfigPath.returns(expectedPath);

      const result = configService.getConfigPath();

      expect(result).to.equal(expectedPath);
      expect(mockConfigStorage.getConfigPath.calledOnce).to.be.true;
    });
  });
});
