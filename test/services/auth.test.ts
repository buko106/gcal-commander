import { expect } from 'chai';

import * as auth from '../../src/auth';
import { AppPaths } from '../../src/utils/paths';

describe('auth service', () => {
  describe('getCredentialsPath', () => {
    it('should return the correct credentials path', () => {
      const expectedPath = AppPaths.getCredentialsPath();
      expect(auth.getCredentialsPath()).to.equal(expectedPath);
    });
  });

  describe('getTokenPath', () => {
    it('should return the correct token path', () => {
      const expectedPath = AppPaths.getTokenPath();
      expect(auth.getTokenPath()).to.equal(expectedPath);
    });
  });

  describe('getCalendarAuth', () => {
    it('should be defined and return a promise', () => {
      expect(auth.getCalendarAuth).to.be.a('function');
      const result = auth.getCalendarAuth();
      expect(result).to.be.a('promise');
    });
  });
});
