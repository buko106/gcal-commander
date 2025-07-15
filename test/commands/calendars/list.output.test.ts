import type { MockedObject } from 'vitest';

import { runCommand } from '@oclif/test';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { ICalendarService } from '../../../src/interfaces/services';

import { TestContainerFactory } from '../../test-utils/mock-factories';

describe('calendars list output', () => {
  let mockCalendarService: ICalendarService & MockedObject<ICalendarService>;

  beforeEach(() => {
    // Set up mock services for testing
    const { mocks } = TestContainerFactory.create();
    mockCalendarService = mocks.calendarService;
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  describe('empty scenarios', () => {
    it('should show "No calendars found" when no calendars exist', async () => {
      mockCalendarService.listCalendars.mockResolvedValue([]);

      const { stderr, stdout } = await runCommand('calendars list');

      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching calendars...');
      expect(stdout).toContain('No calendars found.');
    });

    it('should suppress status messages with --quiet flag for empty calendars', async () => {
      mockCalendarService.listCalendars.mockResolvedValue([]);

      const { stderr, stdout } = await runCommand('calendars list --quiet');

      expect(stderr).to.not.contain('Authenticating with Google Calendar...');
      expect(stderr).to.not.contain('Fetching calendars...');
      expect(stdout).toContain('No calendars found.');
    });
  });

  describe('single calendar scenarios', () => {
    it('should display primary calendar information correctly', async () => {
      mockCalendarService.listCalendars.mockResolvedValue([
        {
          accessRole: 'owner',
          backgroundColor: '#1a73e8',
          description: 'This is my main calendar',
          id: 'primary',
          primary: true,
          summary: 'My Primary Calendar',
        },
      ]);

      const { stderr, stdout } = await runCommand('calendars list');

      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching calendars...');
      expect(stdout).toContain('Available Calendars (1 found)');
      expect(stdout).toContain('My Primary Calendar');
      expect(stdout).toContain('primary');
      expect(stdout).toContain('owner');
      expect(stdout).toContain('This is my main calendar');
      expect(stdout).toContain('#1a73e8');
      expect(stdout).toContain('(Primar');
    });

    it('should display secondary calendar without (Primary) label', async () => {
      mockCalendarService.listCalendars.mockResolvedValue([
        {
          accessRole: 'reader',
          id: 'secondary@example.com',
          primary: false,
          summary: 'Work Calendar',
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).toContain('Work Calendar');
      expect(stdout).to.not.contain('(Primary)');
      expect(stdout).toContain('secondary@example.com');
      expect(stdout).toContain('reader');
    });

    it('should handle calendar with minimal information', async () => {
      mockCalendarService.listCalendars.mockResolvedValue([
        {
          id: 'minimal@example.com',
          summary: 'Minimal Calendar',
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).toContain('Minimal Calendar');
      expect(stdout).toContain('minimal@example.com');
      // Empty values should be empty cells in the table
      expect(stdout).toContain('Available Calendars (1 found)');
    });

    it('should handle calendar with no name', async () => {
      mockCalendarService.listCalendars.mockResolvedValue([
        {
          accessRole: 'writer',
          id: 'unnamed@example.com',
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).toContain('(No name)');
      expect(stdout).toContain('unnamed@example.com');
      expect(stdout).toContain('writer');
    });
  });

  describe('multiple calendars scenarios', () => {
    it('should display multiple calendars in correct order', async () => {
      mockCalendarService.listCalendars.mockResolvedValue([
        {
          accessRole: 'owner',
          id: 'primary',
          primary: true,
          summary: 'Primary Calendar',
        },
        {
          accessRole: 'writer',
          description: 'Work-related events',
          id: 'work@example.com',
          primary: false,
          summary: 'Work Calendar',
        },
        {
          accessRole: 'reader',
          backgroundColor: '#d50000',
          id: 'personal@example.com',
          primary: false,
          summary: 'Personal Calendar',
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).toContain('Available Calendars (3 found)');

      // Check calendar names
      expect(stdout).toContain('Primary Calendar');
      expect(stdout).toContain('Work Calendar');
      expect(stdout).toContain('Personal Calendar');

      // Check specific details
      expect(stdout).toContain('owner');
      expect(stdout).toContain('writer');
      expect(stdout).toContain('reader');
      expect(stdout).toContain('Work-related events');
      expect(stdout).toContain('#d50000');
      expect(stdout).toContain('(Primar');
    });

    it('should handle calendars with special characters and emojis', async () => {
      mockCalendarService.listCalendars.mockResolvedValue([
        {
          accessRole: 'owner',
          description: 'Calendar with 日本語 and other ñøñ-ASCII chars',
          id: 'special@example.com',
          summary: '📅 My Calendar with émojis & spëcial chars',
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).toContain('📅 My Calendar with ém');
      expect(stdout).toContain('Calendar with 日本語 and ot');
    });
  });

  describe('format flags', () => {
    beforeEach(() => {
      mockCalendarService.listCalendars.mockResolvedValue([
        {
          accessRole: 'owner',
          id: 'primary',
          primary: true,
          summary: 'Primary Calendar',
        },
        {
          accessRole: 'reader',
          id: 'secondary@example.com',
          primary: false,
          summary: 'Secondary Calendar',
        },
      ]);
    });

    it('should output valid JSON with --format json', async () => {
      const { stderr, stdout } = await runCommand('calendars list --format json');

      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching calendars...');

      // Should be valid JSON
      expect(() => JSON.parse(stdout)).not.toThrow();

      const calendars = JSON.parse(stdout);
      expect(Array.isArray(calendars)).to.be.true;
      expect(calendars).to.have.length(2);
      expect(calendars[0]).toHaveProperty('id', 'primary');
      expect(calendars[0]).toHaveProperty('summary', 'Primary Calendar');
      expect(calendars[1]).toHaveProperty('id', 'secondary@example.com');

      // Should be minified (no indentation)
      expect(stdout).to.not.contain('\n  ');
      expect(stdout.trim().split('\n')).to.have.length(1);
    });

    it('should output formatted JSON with --format pretty-json', async () => {
      const { stderr, stdout } = await runCommand('calendars list --format pretty-json');

      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching calendars...');

      // Should be valid JSON
      expect(() => JSON.parse(stdout)).not.toThrow();

      const calendars = JSON.parse(stdout);
      expect(Array.isArray(calendars)).to.be.true;
      expect(calendars).to.have.length(2);
      expect(calendars[0]).toHaveProperty('id', 'primary');
      expect(calendars[0]).toHaveProperty('summary', 'Primary Calendar');
      expect(calendars[1]).toHaveProperty('id', 'secondary@example.com');

      // Should be formatted (with indentation)
      expect(stdout).toContain('\n  ');
      expect(stdout.trim().split('\n').length).to.be.greaterThan(1);

      // Should start with array bracket and proper indentation
      expect(stdout.trim()).to.match(/^\[\s*\n\s+{/);
    });

    it('should output table format by default', async () => {
      const { stdout } = await runCommand('calendars list');

      expect(stdout).toContain('Available Calendars (2 found)');
      expect(stdout).toContain('Primary Calendar');
      expect(stdout).toContain('Secondary Calendar');
      expect(stdout).toContain('primary');
      expect(stdout).toContain('owner');
      expect(stdout).toContain('(Primar');
    });

    it('should output table format with explicit --format table', async () => {
      const { stdout } = await runCommand('calendars list --format table');

      expect(stdout).toContain('Available Calendars (2 found)');
      expect(stdout).toContain('Primary Calendar');
      expect(stdout).toContain('(Primar');
    });

    it('should suppress status messages in JSON mode with --quiet', async () => {
      const { stderr, stdout } = await runCommand('calendars list --format json --quiet');

      expect(stderr).to.not.contain('Authenticating with Google Calendar...');
      expect(stderr).to.not.contain('Fetching calendars...');

      const calendars = JSON.parse(stdout);
      expect(calendars).to.have.length(2);
    });
  });

  describe('stdout/stderr separation', () => {
    beforeEach(() => {
      mockCalendarService.listCalendars.mockResolvedValue([
        {
          accessRole: 'owner',
          id: 'test@example.com',
          summary: 'Test Calendar',
        },
      ]);
    });

    it('should send status messages to stderr and results to stdout', async () => {
      const { stderr, stdout } = await runCommand('calendars list');

      // Status messages should be in stderr
      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching calendars...');

      // Results should be in stdout
      expect(stdout).toContain('Available Calendars (1 found)');
      expect(stdout).toContain('Test Calendar');

      // Cross-contamination check
      expect(stdout).to.not.contain('Authenticating with Google Calendar...');
      expect(stderr).to.not.contain('Available Calendars');
    });

    it('should produce clean JSON output for piping', async () => {
      const { stdout } = await runCommand('calendars list --format json');

      // Should be parseable JSON without any extra text
      expect(() => JSON.parse(stdout)).not.toThrow();

      const calendars = JSON.parse(stdout);
      expect(calendars).to.be.an('array');

      // Should not contain any status messages
      expect(stdout).to.not.contain('Authenticating');
      expect(stdout).to.not.contain('Fetching');
    });
  });

  describe('edge cases', () => {
    it('should handle very long calendar names', async () => {
      const longName = 'A'.repeat(200);
      mockCalendarService.listCalendars.mockResolvedValue([
        {
          accessRole: 'owner',
          id: 'long@example.com',
          summary: longName,
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).toContain('AAAAAAAAAAAAAAAAAAAAAA');
      expect(stdout).toContain('long@example.com');
    });

    it('should handle very long descriptions', async () => {
      const longDescription = 'This is a very long description that goes on and on. '.repeat(10);
      mockCalendarService.listCalendars.mockResolvedValue([
        {
          accessRole: 'owner',
          description: longDescription,
          id: 'desc@example.com',
          summary: 'Calendar with Long Description',
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).toContain('Calendar with Long Des');
      expect(stdout).toContain('This is a very long descrip');
    });

    it('should handle empty string values gracefully', async () => {
      mockCalendarService.listCalendars.mockResolvedValue([
        {
          accessRole: '',
          backgroundColor: '',
          description: '',
          id: 'empty@example.com',
          summary: '',
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).toContain('(No name)');
      expect(stdout).toContain('empty@example.com');
      expect(stdout).toContain('Available Calendars (1 found)');
    });
  });

  describe('--fields flag behavior', () => {
    beforeEach(() => {
      mockCalendarService.listCalendars.mockResolvedValue([
        {
          accessRole: 'owner',
          backgroundColor: '#1a73e8',
          description: 'This is my main calendar',
          id: 'primary',
          primary: true,
          summary: 'My Primary Calendar',
        },
      ]);
    });

    it('should show only specified fields with --fields flag', async () => {
      const { stdout } = await runCommand('calendars list --fields=name,id');

      expect(stdout).toContain('Name');
      expect(stdout).toContain('ID');
      expect(stdout).toContain('My Primary Calendar');
      expect(stdout).toContain('primary');

      // These columns should NOT be present
      expect(stdout).to.not.contain('Access');
      expect(stdout).to.not.contain('Description');
      expect(stdout).to.not.contain('Color');
    });

    it('should handle single field with --fields flag', async () => {
      const { stdout } = await runCommand('calendars list --fields=name');

      expect(stdout).toContain('Name');
      expect(stdout).toContain('My Primary Calendar');

      // These columns should NOT be present
      expect(stdout).to.not.contain('ID');
      expect(stdout).to.not.contain('Access');
      expect(stdout).to.not.contain('Description');
      expect(stdout).to.not.contain('Color');
    });

    it('should work with --fields and --format json', async () => {
      const { stdout } = await runCommand('calendars list --fields=name,id --format json');

      // JSON output should not be affected by --fields flag
      expect(() => JSON.parse(stdout)).not.toThrow();
      const calendars = JSON.parse(stdout);
      expect(calendars).to.have.length(1);
      expect(calendars[0]).to.have.property('summary', 'My Primary Calendar');
      expect(calendars[0]).to.have.property('id', 'primary');
    });
  });
});
