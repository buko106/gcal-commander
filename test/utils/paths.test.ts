import { expect } from 'chai';
import { homedir } from 'node:os';
import { join } from 'node:path';

import { AppPaths } from '../../src/utils/paths';

describe('AppPaths', () => {
  const expectedAppDir = join(homedir(), '.gcal-commander');

  describe('getAppDir', () => {
    it('should return the application directory path', () => {
      expect(AppPaths.getAppDir()).to.equal(expectedAppDir);
    });
  });

  describe('getTokenPath', () => {
    it('should return the correct token file path', () => {
      const expectedPath = join(expectedAppDir, 'token.json');
      expect(AppPaths.getTokenPath()).to.equal(expectedPath);
    });
  });

  describe('getCredentialsPath', () => {
    it('should return the correct credentials file path', () => {
      const expectedPath = join(expectedAppDir, 'credentials.json');
      expect(AppPaths.getCredentialsPath()).to.equal(expectedPath);
    });
  });

  describe('getConfigPath', () => {
    it('should return the correct config file path', () => {
      const expectedPath = join(expectedAppDir, 'config.json');
      expect(AppPaths.getConfigPath()).to.equal(expectedPath);
    });
  });

  describe('path consistency', () => {
    it('all paths should be under the same app directory', () => {
      const appDir = AppPaths.getAppDir();

      expect(AppPaths.getTokenPath()).to.include(appDir);
      expect(AppPaths.getCredentialsPath()).to.include(appDir);
      expect(AppPaths.getConfigPath()).to.include(appDir);
    });

    it('should have different file names for different purposes', () => {
      const tokenPath = AppPaths.getTokenPath();
      const credentialsPath = AppPaths.getCredentialsPath();
      const configPath = AppPaths.getConfigPath();

      expect(tokenPath).to.not.equal(credentialsPath);
      expect(tokenPath).to.not.equal(configPath);
      expect(credentialsPath).to.not.equal(configPath);
    });
  });

  describe('error handling', () => {
    it('should handle getAppDir gracefully', () => {
      // This test verifies that getAppDir doesn't throw under normal conditions
      expect(() => AppPaths.getAppDir()).to.not.throw();
    });

    it('should return valid path strings', () => {
      expect(AppPaths.getAppDir()).to.be.a('string').and.not.be.empty;
      expect(AppPaths.getTokenPath()).to.be.a('string').and.not.be.empty;
      expect(AppPaths.getCredentialsPath()).to.be.a('string').and.not.be.empty;
      expect(AppPaths.getConfigPath()).to.be.a('string').and.not.be.empty;
    });
  });
});
