import * as localAuth from '@google-cloud/local-auth';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as auth from '../../src/auth';
import { AppPaths } from '../../src/utils/paths';

// Mock the entire fs/promises module
vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
}));

describe('auth service', () => {
  describe('getCredentialsPath', () => {
    it('should return the correct credentials path', () => {
      const expectedPath = AppPaths.getCredentialsPath();
      expect(auth.getCredentialsPath()).toEqual(expectedPath);
    });
  });

  describe('getTokenPath', () => {
    it('should return the correct token path', () => {
      const expectedPath = AppPaths.getTokenPath();
      expect(auth.getTokenPath()).toEqual(expectedPath);
    });
  });

  describe('getCalendarAuth', () => {
    let authenticateMock: unknown;

    beforeEach(async () => {
      authenticateMock = vi.spyOn(localAuth, 'authenticate').mockResolvedValue({});
      // Mock readFile to simulate no saved credentials
      const { readFile } = await import('node:fs/promises');
      vi.mocked(readFile).mockRejectedValue(new Error('No saved credentials'));
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should call authenticate with correct arguments when no saved credentials exist', async () => {
      const mockClient = { credentials: {} };
      authenticateMock.mockResolvedValue(mockClient);

      try {
        await auth.getCalendarAuth();
      } catch {
        // Authentication may fail due to other dependencies, but we only care about the authenticate call
      }

      expect(authenticateMock).toHaveBeenCalledTimes(1);
      expect(authenticateMock).toHaveBeenCalledWith({
        keyfilePath: auth.getCredentialsPath(),
        scopes: [
          'https://www.googleapis.com/auth/calendar.events',
          'https://www.googleapis.com/auth/calendar.readonly',
        ],
      });
    });
  });
});
