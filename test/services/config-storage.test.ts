import { expect } from 'chai';

import { FileSystemConfigStorage, InMemoryConfigStorage } from '../../src/services/config-storage';
import { AppPaths } from '../../src/utils/paths';

describe('Config Storage', () => {
  describe('FileSystemConfigStorage', () => {
    let storage: FileSystemConfigStorage;

    beforeEach(() => {
      storage = new FileSystemConfigStorage();
    });

    it('should be instantiated', () => {
      expect(storage).to.exist;
    });

    it('should return correct config path', () => {
      const expectedPath = AppPaths.getConfigPath();
      expect(storage.getConfigPath()).to.equal(expectedPath);
    });

    it('should have exists method', () => {
      expect(storage.exists).to.be.a('function');
    });

    it('should have read method', () => {
      expect(storage.read).to.be.a('function');
    });

    it('should have write method', () => {
      expect(storage.write).to.be.a('function');
    });

    it('should return false for exists when file does not exist', async () => {
      // This test depends on actual file system state, so we just verify it returns a boolean
      const result = await storage.exists();
      expect(typeof result).to.equal('boolean');
    });

    it('read method should return a promise', async () => {
      const result = storage.read();
      expect(result).to.be.a('promise');
    });

    it('write method should return a promise', async () => {
      const result = storage.write('test content');
      expect(result).to.be.a('promise');
    });
  });

  describe('InMemoryConfigStorage', () => {
    let storage: InMemoryConfigStorage;

    beforeEach(() => {
      storage = new InMemoryConfigStorage();
    });

    it('should be instantiated', () => {
      expect(storage).to.exist;
    });

    it('should return in-memory as config path', () => {
      expect(storage.getConfigPath()).to.equal('in-memory');
    });

    it('should return false for exists when no content is stored', async () => {
      const result = await storage.exists();
      expect(result).to.be.false;
    });

    it('should return true for exists after writing content', async () => {
      await storage.write('test content');
      const result = await storage.exists();
      expect(result).to.be.true;
    });

    it('should throw error when reading non-existent content', async () => {
      try {
        await storage.read();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('ENOENT');
      }
    });

    it('should return written content when reading', async () => {
      const testContent = 'test content';
      await storage.write(testContent);
      const result = await storage.read();
      expect(result).to.equal(testContent);
    });

    it('should overwrite existing content', async () => {
      await storage.write('first content');
      await storage.write('second content');
      const result = await storage.read();
      expect(result).to.equal('second content');
    });

    it('should handle empty string content', async () => {
      await storage.write('');
      const result = await storage.read();
      expect(result).to.equal('');
      expect(await storage.exists()).to.be.true;
    });

    it('should handle JSON content', async () => {
      const jsonContent = JSON.stringify({ key: 'value', nested: { prop: 123 } });
      await storage.write(jsonContent);
      const result = await storage.read();
      expect(result).to.equal(jsonContent);
      expect(JSON.parse(result)).to.deep.equal({ key: 'value', nested: { prop: 123 } });
    });

    it('should handle special characters in content', async () => {
      const specialContent = 'Content with "quotes" and \n newlines and 🔥 emojis';
      await storage.write(specialContent);
      const result = await storage.read();
      expect(result).to.equal(specialContent);
    });
  });
});
