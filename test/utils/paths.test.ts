import { homedir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { AppPaths } from '../../src/utils/paths';

describe('AppPaths', () => {
  const expectedAppDir = join(homedir(), '.gcal-commander');

  describe('getAppDir', () => {
    it('should return the application directory path', () => {
      expect(AppPaths.getAppDir()).toBe(expectedAppDir);
    });
  });

  describe('getTokenPath', () => {
    it('should return the correct token file path', () => {
      const expectedPath = join(expectedAppDir, 'token.json');
      expect(AppPaths.getTokenPath()).toBe(expectedPath);
    });
  });

  describe('getCredentialsPath', () => {
    it('should return the correct credentials file path', () => {
      const expectedPath = join(expectedAppDir, 'credentials.json');
      expect(AppPaths.getCredentialsPath()).toBe(expectedPath);
    });
  });

  describe('getConfigPath', () => {
    it('should return the correct config file path', () => {
      const expectedPath = join(expectedAppDir, 'config.json');
      expect(AppPaths.getConfigPath()).toBe(expectedPath);
    });
  });

  describe('path consistency', () => {
    it('all paths should be under the same app directory', () => {
      const appDir = AppPaths.getAppDir();

      expect(AppPaths.getTokenPath()).toContain(appDir);
      expect(AppPaths.getCredentialsPath()).toContain(appDir);
      expect(AppPaths.getConfigPath()).toContain(appDir);
    });

    it('should have different file names for different purposes', () => {
      const tokenPath = AppPaths.getTokenPath();
      const credentialsPath = AppPaths.getCredentialsPath();
      const configPath = AppPaths.getConfigPath();

      expect(tokenPath).not.toBe(credentialsPath);
      expect(tokenPath).not.toBe(configPath);
      expect(credentialsPath).not.toBe(configPath);
    });
  });

  describe('error handling', () => {
    it('should handle getAppDir gracefully', () => {
      // This test verifies that getAppDir doesn't throw under normal conditions
      expect(() => AppPaths.getAppDir()).not.toThrow();
    });

    it('should return valid path strings', () => {
      expect(typeof AppPaths.getAppDir()).toBe('string');
      expect(AppPaths.getAppDir()).not.toBe('');
      expect(typeof AppPaths.getTokenPath()).toBe('string');
      expect(AppPaths.getTokenPath()).not.toBe('');
      expect(typeof AppPaths.getCredentialsPath()).toBe('string');
      expect(AppPaths.getCredentialsPath()).not.toBe('');
      expect(typeof AppPaths.getConfigPath()).toBe('string');
      expect(AppPaths.getConfigPath()).not.toBe('');
    });
  });
});
