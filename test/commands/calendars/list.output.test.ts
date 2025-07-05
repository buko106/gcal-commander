import type * as sinon from 'sinon';

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import type { ICalendarService } from '../../../src/interfaces/services';

import { TestContainerFactory } from '../../../src/test-utils/mock-factories/test-container-factory';

describe('calendars list output', () => {
  let mockCalendarService: ICalendarService & sinon.SinonStubbedInstance<ICalendarService>;

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
      mockCalendarService.listCalendars.resolves([]);

      const { stderr, stdout } = await runCommand('calendars list');

      expect(stderr).to.contain('Authenticating with Google Calendar...');
      expect(stderr).to.contain('Fetching calendars...');
      expect(stdout).to.contain('No calendars found.');
    });

    it('should suppress status messages with --quiet flag for empty calendars', async () => {
      mockCalendarService.listCalendars.resolves([]);

      const { stderr, stdout } = await runCommand('calendars list --quiet');

      expect(stderr).to.not.contain('Authenticating with Google Calendar...');
      expect(stderr).to.not.contain('Fetching calendars...');
      expect(stdout).to.contain('No calendars found.');
    });
  });

  describe('single calendar scenarios', () => {
    it('should display primary calendar information correctly', async () => {
      mockCalendarService.listCalendars.resolves([
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

      expect(stderr).to.contain('Authenticating with Google Calendar...');
      expect(stderr).to.contain('Fetching calendars...');
      expect(stdout).to.contain('Available Calendars (1 found)');
      expect(stdout).to.contain('1. My Primary Calendar (Primary)');
      expect(stdout).to.contain('ID: primary');
      expect(stdout).to.contain('Access: owner');
      expect(stdout).to.contain('Description: This is my main calendar');
      expect(stdout).to.contain('Color: #1a73e8');
    });

    it('should display secondary calendar without (Primary) label', async () => {
      mockCalendarService.listCalendars.resolves([
        {
          accessRole: 'reader',
          id: 'secondary@example.com',
          primary: false,
          summary: 'Work Calendar',
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).to.contain('1. Work Calendar');
      expect(stdout).to.not.contain('(Primary)');
      expect(stdout).to.contain('ID: secondary@example.com');
      expect(stdout).to.contain('Access: reader');
    });

    it('should handle calendar with minimal information', async () => {
      mockCalendarService.listCalendars.resolves([
        {
          id: 'minimal@example.com',
          summary: 'Minimal Calendar',
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).to.contain('1. Minimal Calendar');
      expect(stdout).to.contain('ID: minimal@example.com');
      expect(stdout).to.contain('Access:'); // Empty value should still show the label
      expect(stdout).to.not.contain('Description:');
      expect(stdout).to.not.contain('Color:');
    });

    it('should handle calendar with no name', async () => {
      mockCalendarService.listCalendars.resolves([
        {
          accessRole: 'writer',
          id: 'unnamed@example.com',
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).to.contain('1. (No name)');
      expect(stdout).to.contain('ID: unnamed@example.com');
      expect(stdout).to.contain('Access: writer');
    });
  });

  describe('multiple calendars scenarios', () => {
    it('should display multiple calendars in correct order', async () => {
      mockCalendarService.listCalendars.resolves([
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

      expect(stdout).to.contain('Available Calendars (3 found)');

      // Check order and numbering
      expect(stdout).to.contain('1. Primary Calendar (Primary)');
      expect(stdout).to.contain('2. Work Calendar');
      expect(stdout).to.contain('3. Personal Calendar');

      // Check specific details
      expect(stdout).to.contain('Access: owner');
      expect(stdout).to.contain('Access: writer');
      expect(stdout).to.contain('Access: reader');
      expect(stdout).to.contain('Description: Work-related events');
      expect(stdout).to.contain('Color: #d50000');
    });

    it('should handle calendars with special characters and emojis', async () => {
      mockCalendarService.listCalendars.resolves([
        {
          accessRole: 'owner',
          description: 'Calendar with 日本語 and other ñøñ-ASCII chars',
          id: 'special@example.com',
          summary: '📅 My Calendar with émojis & spëcial chars',
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).to.contain('📅 My Calendar with émojis & spëcial chars');
      expect(stdout).to.contain('Calendar with 日本語 and other ñøñ-ASCII chars');
    });
  });

  describe('format flags', () => {
    beforeEach(() => {
      mockCalendarService.listCalendars.resolves([
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

      expect(stderr).to.contain('Authenticating with Google Calendar...');
      expect(stderr).to.contain('Fetching calendars...');

      // Should be valid JSON
      expect(() => JSON.parse(stdout)).to.not.throw();

      const calendars = JSON.parse(stdout);
      expect(Array.isArray(calendars)).to.be.true;
      expect(calendars).to.have.length(2);
      expect(calendars[0]).to.have.property('id', 'primary');
      expect(calendars[0]).to.have.property('summary', 'Primary Calendar');
      expect(calendars[1]).to.have.property('id', 'secondary@example.com');

      // Should be minified (no indentation)
      expect(stdout).to.not.contain('\n  ');
      expect(stdout.trim().split('\n')).to.have.length(1);
    });

    it('should output formatted JSON with --format pretty-json', async () => {
      const { stderr, stdout } = await runCommand('calendars list --format pretty-json');

      expect(stderr).to.contain('Authenticating with Google Calendar...');
      expect(stderr).to.contain('Fetching calendars...');

      // Should be valid JSON
      expect(() => JSON.parse(stdout)).to.not.throw();

      const calendars = JSON.parse(stdout);
      expect(Array.isArray(calendars)).to.be.true;
      expect(calendars).to.have.length(2);
      expect(calendars[0]).to.have.property('id', 'primary');
      expect(calendars[0]).to.have.property('summary', 'Primary Calendar');
      expect(calendars[1]).to.have.property('id', 'secondary@example.com');

      // Should be formatted (with indentation)
      expect(stdout).to.contain('\n  ');
      expect(stdout.trim().split('\n').length).to.be.greaterThan(1);

      // Should start with array bracket and proper indentation
      expect(stdout.trim()).to.match(/^\[\s*\n\s+{/);
    });

    it('should output table format by default', async () => {
      const { stdout } = await runCommand('calendars list');

      expect(stdout).to.contain('Available Calendars (2 found)');
      expect(stdout).to.contain('1. Primary Calendar (Primary)');
      expect(stdout).to.contain('2. Secondary Calendar');
      expect(stdout).to.contain('ID: primary');
      expect(stdout).to.contain('Access: owner');
    });

    it('should output table format with explicit --format table', async () => {
      const { stdout } = await runCommand('calendars list --format table');

      expect(stdout).to.contain('Available Calendars (2 found)');
      expect(stdout).to.contain('1. Primary Calendar (Primary)');
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
      mockCalendarService.listCalendars.resolves([
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
      expect(stderr).to.contain('Authenticating with Google Calendar...');
      expect(stderr).to.contain('Fetching calendars...');

      // Results should be in stdout
      expect(stdout).to.contain('Available Calendars (1 found)');
      expect(stdout).to.contain('Test Calendar');

      // Cross-contamination check
      expect(stdout).to.not.contain('Authenticating with Google Calendar...');
      expect(stderr).to.not.contain('Available Calendars');
    });

    it('should produce clean JSON output for piping', async () => {
      const { stdout } = await runCommand('calendars list --format json');

      // Should be parseable JSON without any extra text
      expect(() => JSON.parse(stdout)).to.not.throw();

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
      mockCalendarService.listCalendars.resolves([
        {
          accessRole: 'owner',
          id: 'long@example.com',
          summary: longName,
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).to.contain(longName);
      expect(stdout).to.contain('ID: long@example.com');
    });

    it('should handle very long descriptions', async () => {
      const longDescription = 'This is a very long description that goes on and on. '.repeat(10);
      mockCalendarService.listCalendars.resolves([
        {
          accessRole: 'owner',
          description: longDescription,
          id: 'desc@example.com',
          summary: 'Calendar with Long Description',
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).to.contain('Calendar with Long Description');
      expect(stdout).to.contain(longDescription);
    });

    it('should handle empty string values gracefully', async () => {
      mockCalendarService.listCalendars.resolves([
        {
          accessRole: '',
          backgroundColor: '',
          description: '',
          id: 'empty@example.com',
          summary: '',
        },
      ]);

      const { stdout } = await runCommand('calendars list');

      expect(stdout).to.contain('1. (No name)');
      expect(stdout).to.contain('ID: empty@example.com');
      expect(stdout).to.contain('Access:');
      expect(stdout).to.not.contain('Description:');
      expect(stdout).to.not.contain('Color:');
    });
  });
});
