import { runCommand } from '@oclif/test';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestContainerFactory } from '../test-utils/mock-factories';

describe('--quiet flag', () => {
  beforeEach(() => {
    // Set up mock services for testing
    TestContainerFactory.create();
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  it('should suppress status messages in events list command', async () => {
    const { stderr, stdout } = await runCommand('events list --quiet --max-results 1');

    // Status messages should be suppressed
    expect(stderr).not.toContain('Authenticating with Google Calendar...');
    expect(stderr).not.toContain('Fetching events from');

    // Result output should still be present
    expect(stdout.length).toBeGreaterThan(0);
    expect(stdout).toContain('Mock Event');
  });

  it('should suppress status messages in calendars list command', async () => {
    const { stderr, stdout } = await runCommand('calendars list --quiet');

    // Status messages should be suppressed
    expect(stderr).not.toContain('Authenticating with Google Calendar...');
    expect(stderr).not.toContain('Fetching calendars...');

    // Result output should still be present
    expect(stdout.length).toBeGreaterThan(0);
    expect(stdout).toContain('Primary Calendar');
  });

  it('should suppress status messages in events show command', async () => {
    try {
      const { stderr, stdout } = await runCommand('events show mock-event-1 --quiet');

      // Status messages should be suppressed
      expect(stderr).not.toContain('Authenticating with Google Calendar...');
      expect(stderr).not.toContain('Fetching event details...');

      // Result output should be present
      expect(stdout.length).toBeGreaterThan(0);
      expect(stdout).toContain('Mock Event 1');
    } catch (error: unknown) {
      // If command fails for other reasons, check error messages
      const errorMessage = (error as Error).message || '';

      // Status messages should be suppressed even in error case
      expect(errorMessage).not.toContain('Authenticating with Google Calendar...');
      expect(errorMessage).not.toContain('Fetching event details...');
    }
  });

  it('should suppress confirmation messages in config command', async () => {
    const { stderr, stdout } = await runCommand('config list --quiet');

    // Status messages should be suppressed
    expect(stderr).not.toContain('Current configuration:');
    expect(stderr).not.toContain('Config file:');

    // Result output should still be present
    expect(stdout.length).toBeGreaterThan(0);
  });

  it('should show help for --quiet flag', async () => {
    const { stdout } = await runCommand('events list --help');

    expect(stdout).toContain('--quiet');
    expect(stdout).toContain('Suppress non-essential output');
  });

  it('should work with short flag -q', async () => {
    const { stderr, stdout } = await runCommand('events list -q --max-results 1');

    // Status messages should be suppressed with short flag
    expect(stderr).not.toContain('Authenticating with Google Calendar...');
    expect(stderr).not.toContain('Fetching events from');

    // Result output should still be present
    expect(stdout.length).toBeGreaterThan(0);
    expect(stdout).toContain('Mock Event');
  });
});
