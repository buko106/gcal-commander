import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock modules at the top level
vi.mock('@google-cloud/local-auth');
vi.mock('node:fs/promises');

import * as localAuth from '@google-cloud/local-auth';
// eslint-disable-next-line n/no-extraneous-import
import { OAuth2Client } from 'google-auth-library';
import fs from 'node:fs/promises';

import * as auth from '../../src/auth';
import { AppPaths } from '../../src/utils/paths';

describe('auth service', () => {
  describe('getCredentialsPath', () => {
    it('should return the correct credentials path', () => {
      const expectedPath = AppPaths.getCredentialsPath();
      expect(auth.getCredentialsPath()).toBe(expectedPath);
    });
  });

  describe('getTokenPath', () => {
    it('should return the correct token path', () => {
      const expectedPath = AppPaths.getTokenPath();
      expect(auth.getTokenPath()).toBe(expectedPath);
    });
  });

  describe('getCalendarAuth', () => {
    const mockLocalAuth = vi.mocked(localAuth);
    const mockFs = vi.mocked(fs);

    beforeEach(() => {
      vi.clearAllMocks();
      // Mock readFile to simulate no saved credentials
      mockFs.readFile.mockRejectedValue(new Error('No saved credentials'));
    });

    it('should call authenticate with correct arguments when no saved credentials exist', async () => {
      const mockClient = { credentials: {} };
      mockLocalAuth.authenticate.mockResolvedValue(mockClient as OAuth2Client);

      try {
        await auth.getCalendarAuth();
      } catch {
        // Authentication may fail due to other dependencies, but we only care about the authenticate call
      }

      expect(mockLocalAuth.authenticate).toHaveBeenCalledOnce();
      expect(mockLocalAuth.authenticate).toHaveBeenCalledWith({
        keyfilePath: auth.getCredentialsPath(),
        scopes: [
          'https://www.googleapis.com/auth/calendar.events',
          'https://www.googleapis.com/auth/calendar.readonly',
        ],
      });
    });
  });
});
