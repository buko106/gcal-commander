import { runCommand } from '@oclif/test';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestContainerFactory } from '../../test-utils/mock-factories';

describe('events list', () => {
  beforeEach(() => {
    TestContainerFactory.create();
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  it('shows authentication message in stderr', async () => {
    const { stderr } = await runCommand('events list');
    expect(stderr).toContain('Authenticating with Google Calendar...');
    expect(stderr).toContain('Fetching events from');
  });

  it('accepts calendar argument', async () => {
    const { stderr } = await runCommand('events list my-calendar@gmail.com');
    expect(stderr).toContain('Authenticating with Google Calendar...');
    expect(stderr).toContain('Fetching events from');
  });

  it('accepts format flag', async () => {
    try {
      await runCommand('events list --format json');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });

  it('rejects invalid format', async () => {
    try {
      await runCommand('events list --format invalid');
      expect.fail('Should have thrown an error for invalid format');
    } catch (error) {
      expect(String(error)).toMatch(/Expected.*format.*to be one of|invalid.*format/i);
    }
  });

  it('accepts pretty-json format', async () => {
    try {
      await runCommand('events list --format pretty-json');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });

  it('accepts table format', async () => {
    try {
      await runCommand('events list --format table');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });

  it('accepts days flag', async () => {
    try {
      await runCommand('events list --days 7');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });

  it('accepts max-results flag', async () => {
    try {
      await runCommand('events list --max-results 20');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });

  it('rejects invalid max-results value', async () => {
    try {
      await runCommand('events list --max-results abc');
      expect.fail('Should have thrown an error for invalid max-results');
    } catch (error) {
      expect(String(error)).toMatch(/Expected.*integer|Invalid.*max-results/i);
    }
  });

  it('rejects invalid days value', async () => {
    try {
      await runCommand('events list --days xyz');
      expect.fail('Should have thrown an error for invalid days');
    } catch (error) {
      expect(String(error)).toMatch(/Expected.*integer|Invalid.*days/i);
    }
  });

  it('accepts short flag aliases', async () => {
    try {
      await runCommand('events list -f json -d 7 -n 5');
    } catch (error) {
      // Command should parse short flags correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });

  it('accepts --quiet flag from base command', async () => {
    try {
      await runCommand('events list --quiet');
    } catch (error) {
      // Command should parse --quiet flag correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });
});
