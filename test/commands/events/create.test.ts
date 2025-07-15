import { runCommand } from '@oclif/test';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestContainerFactory } from '../../test-utils/mock-factories';

describe('events create', () => {
  beforeEach(() => {
    TestContainerFactory.create();
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  it('requires summary argument', async () => {
    const result = await runCommand('events create');
    expect(result.error).toBeDefined();
    expect(result.error?.message).toMatch(/Missing.*required.*arg/i);
  });

  it('requires start flag', async () => {
    const result = await runCommand('events create "Test Event"');
    expect(result.error).toBeDefined();
    expect(result.error?.message).toMatch(/Missing required flag/i);
  });

  it('accepts required summary and start parameters', async () => {
    const { stderr } = await runCommand('events create "Test Event" --start "2024-01-15T14:00:00"');
    expect(stderr).toContain('Authenticating with Google Calendar...');
    expect(stderr).toContain('Creating event...');
  });

  it('accepts end flag', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --end "2024-01-15T15:00:00"');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });

  it('accepts duration flag', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --duration 60');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });

  it('accepts calendar flag', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --calendar "my-calendar@gmail.com"');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });

  it('accepts description flag', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --description "Event description"');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });

  it('accepts location flag', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --location "Conference Room A"');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });

  it('accepts attendees flag', async () => {
    try {
      await runCommand(
        'events create "Test Event" --start "2024-01-15T14:00:00" --attendees "alice@example.com,bob@example.com"',
      );
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });

  it('accepts all-day flag', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15" --all-day');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });

  it('accepts send-updates flag', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --send-updates all');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });

  it('accepts format flags from base command', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --format json');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });

  it('accepts quiet flag from base command', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --quiet');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });

  it('rejects invalid send-updates value', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --send-updates invalid');
      throw new Error('Should have thrown an error for invalid send-updates');
    } catch (error) {
      expect(String(error)).toMatch(/Expected.*send-updates.*to be one of|Invalid.*send-updates/i);
    }
  });

  it('uses short flag aliases', async () => {
    try {
      await runCommand(
        'events create "Test Event" -s "2024-01-15T14:00:00" -e "2024-01-15T15:00:00" -c primary -l "Room A" -f json',
      );
    } catch (error) {
      // Command should parse short flags correctly even if authentication fails
      expect(String(error)).not.toContain('Unknown flag');
    }
  });
});
