import { runCommand } from '@oclif/test';
import { expect } from 'chai';
import { rm } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

const TEST_CONFIG_DIR = join(homedir(), '.gcal-commander-test');

describe('config', () => {
  beforeEach(async () => {
    // Clean up test config directory
    try {
      await rm(TEST_CONFIG_DIR, { force: true, recursive: true });
    } catch {
      // Ignore errors if directory doesn't exist
    }
  });

  afterEach(async () => {
    // Clean up after each test
    try {
      await rm(TEST_CONFIG_DIR, { force: true, recursive: true });
    } catch {
      // Ignore errors if directory doesn't exist
    }
  });

  describe('config list', () => {
    it('shows empty configuration when no config exists', async () => {
      const { stdout } = await runCommand('config list');
      expect(stdout).to.contain('No configuration set');
      expect(stdout).to.contain('Config file:');
    });

    it('supports JSON format', async () => {
      const { stdout } = await runCommand('config list --format json');
      expect(stdout.trim()).to.equal('{}');
    });
  });

  describe('config set', () => {
    it('sets a simple configuration value', async () => {
      const { stdout } = await runCommand('config set defaultCalendar test@example.com');
      expect(stdout).to.contain('Set defaultCalendar = "test@example.com"');
    });

    it('sets nested configuration values', async () => {
      const { stdout } = await runCommand('config set events.maxResults 25');
      expect(stdout).to.contain('Set events.maxResults = 25');
    });

    it('validates number values', async () => {
      try {
        await runCommand('config set events.maxResults invalid');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        // Error from oclif may be in different formats
        const errorText = error.message || error.stderr || String(error);
        expect(errorText).to.contain('Invalid number value');
      }
    });

    it('validates value ranges', async () => {
      try {
        await runCommand('config set events.maxResults 150');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message || String(error)).to.contain('must be a number between 1 and 100');
      }
    });

    it('validates configuration keys', async () => {
      try {
        await runCommand('config set invalidKey value');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message || String(error)).to.contain('Invalid configuration key');
      }
    });

    it('validates enum values', async () => {
      try {
        await runCommand('config set events.format invalid');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message || String(error)).to.contain('must be either "table" or "json"');
      }
    });
  });

  describe('config get', () => {
    it('gets a configuration value', async () => {
      await runCommand('config set defaultCalendar test@example.com');
      const { stdout } = await runCommand('config get defaultCalendar');
      expect(stdout).to.contain('defaultCalendar = "test@example.com"');
    });

    it('shows message for unset values', async () => {
      // Ensure no previous config exists
      try {
        await runCommand('config reset --confirm');
      } catch {
        // Ignore if reset fails (no config to reset)
      }
      
      const { stdout } = await runCommand('config get defaultCalendar');
      expect(stdout).to.contain("Configuration key 'defaultCalendar' is not set");
    });

    it('validates configuration keys', async () => {
      try {
        await runCommand('config get invalidKey');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message || String(error)).to.contain('Invalid configuration key');
      }
    });
  });

  describe('config unset', () => {
    it('unsets a configuration value', async () => {
      await runCommand('config set defaultCalendar test@example.com');
      const { stdout } = await runCommand('config unset defaultCalendar');
      expect(stdout).to.contain('Unset defaultCalendar');
    });

    it('shows message for already unset values', async () => {
      const { stdout } = await runCommand('config unset defaultCalendar');
      expect(stdout).to.contain("Configuration key 'defaultCalendar' is not set");
    });

    it('validates configuration keys', async () => {
      try {
        await runCommand('config unset invalidKey');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message || String(error)).to.contain('Invalid configuration key');
      }
    });
  });

  describe('config reset', () => {
    it('requires confirmation flag', async () => {
      await runCommand('config set defaultCalendar test@example.com');
      const { stdout } = await runCommand('config reset');
      expect(stdout).to.contain('Use --confirm flag to proceed');
    });

    it('resets all configuration with confirmation', async () => {
      await runCommand('config set defaultCalendar test@example.com');
      await runCommand('config set events.maxResults 25');
      
      const { stdout } = await runCommand('config reset --confirm');
      expect(stdout).to.contain('All configuration settings have been reset');
      
      const { stdout: listOutput } = await runCommand('config list');
      expect(listOutput).to.contain('No configuration set');
    });
  });

  describe('error handling', () => {
    it('requires subcommand', async () => {
      try {
        await runCommand('config');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message || String(error)).to.contain('Missing 1 required arg');
      }
    });

    it('requires key for get command', async () => {
      try {
        await runCommand('config get');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message || String(error)).to.contain('Key is required for get command');
      }
    });

    it('requires key and value for set command', async () => {
      try {
        await runCommand('config set');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message || String(error)).to.contain('Key and value are required for set command');
      }

      try {
        await runCommand('config set defaultCalendar');
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message || String(error)).to.contain('Key and value are required for set command');
      }
    });
  });
});