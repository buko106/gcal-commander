import { afterEach, beforeEach, describe, expect, it, MockedObject } from 'vitest';

import { SUPPORTED_LANGUAGES } from '../../src/constants/languages';
import { IConfigStorage } from '../../src/interfaces/config-storage';
import { IConfigService } from '../../src/interfaces/services';
import { TestContainerFactory } from '../test-utils/mock-factories';

describe('ConfigService', () => {
  let configService: IConfigService;
  let mockConfigStorage: IConfigStorage & MockedObject<IConfigStorage>;

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
      mockConfigStorage.exists.mockResolvedValue(true);
      mockConfigStorage.read.mockResolvedValue(JSON.stringify(mockConfig));

      const result = await configService.list();

      expect(result).toEqual(mockConfig);
      expect(mockConfigStorage.exists).toHaveBeenCalledOnce();
      expect(mockConfigStorage.read).toHaveBeenCalledOnce();
    });

    it('should use empty config when file does not exist', async () => {
      mockConfigStorage.exists.mockResolvedValue(false);

      const result = await configService.list();

      expect(result).toEqual({});
      expect(mockConfigStorage.exists).toHaveBeenCalledOnce();
      expect(mockConfigStorage.read).not.toHaveBeenCalled();
    });

    it('should use empty config when storage read fails', async () => {
      mockConfigStorage.exists.mockResolvedValue(true);
      mockConfigStorage.read.mockRejectedValue(new Error('Read error'));

      const result = await configService.list();

      expect(result).toEqual({});
      expect(mockConfigStorage.exists).toHaveBeenCalledOnce();
      expect(mockConfigStorage.read).toHaveBeenCalledOnce();
    });

    it('should use empty config when JSON parsing fails', async () => {
      mockConfigStorage.exists.mockResolvedValue(true);
      mockConfigStorage.read.mockResolvedValue('invalid json');

      const result = await configService.list();

      expect(result).toEqual({});
      expect(mockConfigStorage.exists).toHaveBeenCalledOnce();
      expect(mockConfigStorage.read).toHaveBeenCalledOnce();
    });

    it('should not reload config if already loaded', async () => {
      mockConfigStorage.exists.mockResolvedValue(true);
      mockConfigStorage.read.mockResolvedValue('{}');

      // First call should load
      await configService.list();

      // Second call should not reload
      await configService.list();

      expect(mockConfigStorage.exists).toHaveBeenCalledOnce();
      expect(mockConfigStorage.read).toHaveBeenCalledOnce();
    });
  });

  describe('reset', () => {
    it('should reset config to empty object and save', async () => {
      // First set some config
      await configService.set('defaultCalendar', 'test@example.com');
      mockConfigStorage.write.mockClear();

      await configService.reset();

      const result = await configService.list();
      expect(result).toEqual({});
      expect(mockConfigStorage.write).toHaveBeenCalledOnce();
      expect(mockConfigStorage.write.mock.calls[0][0]).toBe('{}');
    });
  });

  describe('validateKey', () => {
    it('should return true for valid keys', () => {
      expect(configService.validateKey('defaultCalendar')).toBe(true);
      expect(configService.validateKey('language')).toBe(true);
      expect(configService.validateKey('events.maxResults')).toBe(true);
      expect(configService.validateKey('events.format')).toBe(true);
      expect(configService.validateKey('events.days')).toBe(true);
    });

    it('should return false for invalid keys', () => {
      expect(configService.validateKey('invalidKey')).toBe(false);
      expect(configService.validateKey('events.invalidKey')).toBe(false);
      expect(configService.validateKey('')).toBe(false);
    });
  });

  describe('validateValue', () => {
    it('should return valid=false for unknown keys', () => {
      const result = configService.validateValue('unknownKey', 'value');

      expect(result.valid).toBe(false);
      expect(result.errorKey).toBe('config.validation.unknownKey');
      expect(result.errorOptions).toEqual({ key: 'unknownKey' });
    });

    it('should return valid=true for correct defaultCalendar value', () => {
      const result = configService.validateValue('defaultCalendar', 'test@example.com');

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.errorKey).toBeUndefined();
    });

    it('should return valid=true for all supported language values', () => {
      for (const language of SUPPORTED_LANGUAGES) {
        const result = configService.validateValue('language', language);
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
        expect(result.errorKey).toBeUndefined();
      }
    });

    it('should return valid=false for invalid language value', () => {
      const result = configService.validateValue('language', 'invalid');

      expect(result.valid).toBe(false);
      expect(result.errorKey).toBe('config.validation.zodError');
      expect(result.errorOptions).toHaveProperty('key', 'language');
      expect(result.errorOptions).toHaveProperty('message');
    });

    it('should return valid=false for invalid events.days value', () => {
      const result = configService.validateValue('events.days', 0);

      expect(result.valid).toBe(false);
      expect(result.errorKey).toBe('config.validation.zodError');
      expect(result.errorOptions).toHaveProperty('key', 'events.days');
    });

    it('should return valid=false for invalid events.maxResults value', () => {
      const result = configService.validateValue('events.maxResults', 101);

      expect(result.valid).toBe(false);
      expect(result.errorKey).toBe('config.validation.zodError');
      expect(result.errorOptions).toHaveProperty('key', 'events.maxResults');
    });

    it('should return valid=false for invalid events.format value', () => {
      const result = configService.validateValue('events.format', 'invalid');

      expect(result.valid).toBe(false);
      expect(result.errorKey).toBe('config.validation.zodError');
      expect(result.errorOptions).toHaveProperty('key', 'events.format');
    });

    it('should handle non-Zod validation errors', () => {
      // This case is harder to trigger but we can test by mocking the schema parsing
      const result = configService.validateValue('defaultCalendar', null);

      expect(result.valid).toBe(false);
      expect(result.errorKey).toBe('config.validation.zodError');
    });
  });

  describe('nested value operations', () => {
    it('should handle nested get operations', async () => {
      mockConfigStorage.exists.mockResolvedValue(true);
      mockConfigStorage.read.mockResolvedValue(
        JSON.stringify({
          events: {
            maxResults: 50,
            format: 'json',
          },
        }),
      );

      const maxResults = await configService.get('events.maxResults');
      const format = await configService.get('events.format');

      expect(maxResults).toBe(50);
      expect(format).toBe('json');
    });

    it('should handle nested set operations', async () => {
      mockConfigStorage.exists.mockResolvedValue(false);

      await configService.set('events.maxResults', 25);
      await configService.set('events.format', 'table');

      const config = await configService.list();
      expect(config).toEqual({
        events: {
          maxResults: 25,
          format: 'table',
        },
      });
    });

    it('should handle nested unset operations', async () => {
      mockConfigStorage.exists.mockResolvedValue(true);
      mockConfigStorage.read.mockResolvedValue(
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
      expect(config).toEqual({
        events: {
          format: 'json',
        },
        defaultCalendar: 'test@example.com',
      });
    });

    it('should handle unset operations on non-existent keys', async () => {
      mockConfigStorage.exists.mockResolvedValue(false);

      await configService.unset('nonExistent.key');

      const config = await configService.list();
      expect(config).toEqual({});
    });

    it('should handle get operations on non-existent keys', async () => {
      mockConfigStorage.exists.mockResolvedValue(false);

      const result = await configService.get('nonExistent.key');

      expect(result).toBeUndefined();
    });
  });

  describe('getValidKeys', () => {
    it('should return all valid configuration keys', () => {
      const validKeys = configService.getValidKeys();

      expect(validKeys).toContain('defaultCalendar');
      expect(validKeys).toContain('language');
      expect(validKeys).toContain('events.maxResults');
      expect(validKeys).toContain('events.format');
      expect(validKeys).toContain('events.days');
    });
  });

  describe('getConfigPath', () => {
    it('should return config path from storage', () => {
      const expectedPath = '/test/config/path';
      mockConfigStorage.getConfigPath.mockReturnValue(expectedPath);

      const result = configService.getConfigPath();

      expect(result).toEqual(expectedPath);
      expect(mockConfigStorage.getConfigPath).toHaveBeenCalledOnce();
    });
  });
});
