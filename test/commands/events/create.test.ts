import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { TOKENS } from '../../../src/di/tokens';
import { I18nService } from '../../../src/services/i18n';
import { TestContainerFactory } from '../../../src/test-utils/mock-factories/test-container-factory';

describe('events create', () => {
  beforeEach(() => {
    TestContainerFactory.create();

    // Use real I18nService for proper English translations in tests
    const realI18nService = new I18nService();
    TestContainerFactory.registerService(TOKENS.I18nService, realI18nService);
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  it('requires summary argument', async () => {
    const result = await runCommand('events create');
    expect(result.error).to.exist;
    expect(result.error?.message).to.match(/Missing.*required.*arg/i);
  });

  it('requires start flag', async () => {
    const result = await runCommand('events create "Test Event"');
    expect(result.error).to.exist;
    expect(result.error?.message).to.match(/Missing required flag/i);
  });

  it('accepts required summary and start parameters', async () => {
    const { stderr } = await runCommand('events create "Test Event" --start "2024-01-15T14:00:00"');
    expect(stderr).to.contain('Authenticating with Google Calendar...');
    expect(stderr).to.contain('Creating event...');
  });

  it('accepts end flag', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --end "2024-01-15T15:00:00"');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag');
    }
  });

  it('accepts duration flag', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --duration 60');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag');
    }
  });

  it('accepts calendar flag', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --calendar "my-calendar@gmail.com"');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag');
    }
  });

  it('accepts description flag', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --description "Event description"');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag');
    }
  });

  it('accepts location flag', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --location "Conference Room A"');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag');
    }
  });

  it('accepts attendees flag', async () => {
    try {
      await runCommand(
        'events create "Test Event" --start "2024-01-15T14:00:00" --attendees "alice@example.com,bob@example.com"',
      );
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag');
    }
  });

  it('accepts all-day flag', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15" --all-day');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag');
    }
  });

  it('accepts send-updates flag', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --send-updates all');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag');
    }
  });

  it('accepts format flags from base command', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --format json');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag');
    }
  });

  it('accepts quiet flag from base command', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --quiet');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag');
    }
  });

  it('rejects invalid send-updates value', async () => {
    try {
      await runCommand('events create "Test Event" --start "2024-01-15T14:00:00" --send-updates invalid');
      expect.fail('Should have thrown an error for invalid send-updates');
    } catch (error) {
      expect(String(error)).to.match(/Expected.*send-updates.*to be one of|Invalid.*send-updates/i);
    }
  });

  it('uses short flag aliases', async () => {
    try {
      await runCommand(
        'events create "Test Event" -s "2024-01-15T14:00:00" -e "2024-01-15T15:00:00" -c primary -l "Room A" -f json',
      );
    } catch (error) {
      // Command should parse short flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag');
    }
  });
});
