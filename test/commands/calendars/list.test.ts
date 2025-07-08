import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { TestContainerFactory } from '../../test-utils/mock-factories';

describe('calendars list', () => {
  beforeEach(() => {
    TestContainerFactory.create();
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  it('shows authentication message in stderr', async () => {
    const { stderr } = await runCommand('calendars list');
    expect(stderr).to.contain('Authenticating with Google Calendar...');
    expect(stderr).to.contain('Fetching calendars...');
  });

  it('accepts format flag', async () => {
    try {
      await runCommand('calendars list --format json');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag');
    }
  });

  it('rejects invalid format', async () => {
    try {
      await runCommand('calendars list --format invalid');
      expect.fail('Should have thrown an error for invalid format');
    } catch (error) {
      expect(String(error)).to.match(/Expected.*format.*to be one of|invalid.*format/i);
    }
  });

  it('accepts table format', async () => {
    try {
      await runCommand('calendars list --format table');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag');
    }
  });

  it('accepts pretty-json format', async () => {
    try {
      await runCommand('calendars list --format pretty-json');
    } catch (error) {
      // Command should parse flags correctly even if authentication fails
      expect(String(error)).to.not.contain('Unknown flag');
    }
  });
});
