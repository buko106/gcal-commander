import * as localAuth from '@google-cloud/local-auth';
import { expect } from 'chai';
import fs from 'node:fs/promises';
import { SinonStub, stub } from 'sinon';

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
    let authenticateStub: SinonStub;
    let readFileStub: SinonStub;

    beforeEach(() => {
      authenticateStub = stub(localAuth, 'authenticate');
      // Mock readFile to simulate no saved credentials
      readFileStub = stub(fs, 'readFile').rejects(new Error('No saved credentials'));
    });

    afterEach(() => {
      authenticateStub.restore();
      readFileStub.restore();
    });

    it('should call authenticate with correct arguments when no saved credentials exist', async () => {
      const mockClient = { credentials: {} };
      authenticateStub.resolves(mockClient);

      try {
        await auth.getCalendarAuth();
      } catch {
        // Authentication may fail due to other dependencies, but we only care about the authenticate call
      }

      expect(authenticateStub.calledOnce).to.be.true;
      expect(authenticateStub.firstCall.args[0]).to.deep.equal({
        keyfilePath: auth.getCredentialsPath(),
        scopes: [
          'https://www.googleapis.com/auth/calendar.events',
          'https://www.googleapis.com/auth/calendar.readonly',
        ],
      });
    });
  });
});
