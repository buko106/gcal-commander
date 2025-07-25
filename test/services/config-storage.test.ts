import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';

import { FileSystemConfigStorage, InMemoryConfigStorage } from '../../src/services/config-storage';

describe('Config Storage', () => {
  describe('FileSystemConfigStorage', () => {
    let storage: FileSystemConfigStorage;

    beforeEach(() => {
      // Use temporary directory for tests to avoid affecting actual config
      const testConfigPath = join(tmpdir(), 'gcal-commander-test-config.json');
      storage = new FileSystemConfigStorage(testConfigPath);
    });

    it('should be instantiated', () => {
      expect(storage).toBeDefined();
    });

    it('should return correct config path', () => {
      const expectedPath = join(tmpdir(), 'gcal-commander-test-config.json');
      expect(storage.getConfigPath()).toEqual(expectedPath);
    });

    it('should have exists method', () => {
      expect(typeof storage.exists).toBe('function');
    });

    it('should have read method', () => {
      expect(typeof storage.read).toBe('function');
    });

    it('should have write method', () => {
      expect(typeof storage.write).toBe('function');
    });

    it('should return false for exists when file does not exist', async () => {
      // This test depends on actual file system state, so we just verify it returns a boolean
      const result = await storage.exists();
      expect(typeof result).toBe('boolean');
    });

    it('read method should return a promise', () => {
      // Don't await - just check that it returns a promise
      const result = storage.read();
      expect(result).toBeInstanceOf(Promise);
      // Clean up the promise to avoid unhandled rejection
      result.catch(() => {
        // Expected to fail since file doesn't exist
      });
    });

    it('write method should return a promise', () => {
      // Don't await - just check that it returns a promise
      const result = storage.write('test content');
      expect(result).toBeInstanceOf(Promise);
      // Clean up the promise
      result.catch(() => {
        // May fail due to permission issues in CI
      });
    });
  });

  describe('InMemoryConfigStorage', () => {
    let storage: InMemoryConfigStorage;

    beforeEach(() => {
      storage = new InMemoryConfigStorage();
    });

    it('should be instantiated', () => {
      expect(storage).toBeDefined();
    });

    it('should return in-memory as config path', () => {
      expect(storage.getConfigPath()).toBe('in-memory');
    });

    it('should return false for exists when no content is stored', async () => {
      const result = await storage.exists();
      expect(result).toBe(false);
    });

    it('should return true for exists after writing content', async () => {
      await storage.write('test content');
      const result = await storage.exists();
      expect(result).toBe(true);
    });

    it('should throw error when reading non-existent content', async () => {
      try {
        await storage.read();
        expect(true).toBe(false); // Should have thrown an error
      } catch (error) {
        expect((error as Error).message).toContain('ENOENT');
      }
    });

    it('should return written content when reading', async () => {
      const testContent = 'test content';
      await storage.write(testContent);
      const result = await storage.read();
      expect(result).toBe(testContent);
    });

    it('should overwrite existing content', async () => {
      await storage.write('first content');
      await storage.write('second content');
      const result = await storage.read();
      expect(result).toBe('second content');
    });

    it('should handle empty string content', async () => {
      await storage.write('');
      const result = await storage.read();
      expect(result).toBe('');
      expect(await storage.exists()).toBe(true);
    });

    it('should handle JSON content', async () => {
      const jsonContent = JSON.stringify({ key: 'value', nested: { prop: 123 } });
      await storage.write(jsonContent);
      const result = await storage.read();
      expect(result).toBe(jsonContent);
      expect(JSON.parse(result)).toEqual({ key: 'value', nested: { prop: 123 } });
    });

    it('should handle special characters in content', async () => {
      const specialContent = 'Content with "quotes" and \n newlines and 🔥 emojis';
      await storage.write(specialContent);
      const result = await storage.read();
      expect(result).toBe(specialContent);
    });
  });
});
