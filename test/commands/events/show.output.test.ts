import type * as sinon from 'sinon';

import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import type { ICalendarService } from '../../../src/interfaces/services';

import { TestContainerFactory } from '../../../src/test-utils/mock-factories/test-container-factory';

describe('events show output', () => {
  let mockCalendarService: ICalendarService & sinon.SinonStubbedInstance<ICalendarService>;

  beforeEach(() => {
    const { mocks } = TestContainerFactory.create();
    mockCalendarService = mocks.calendarService;
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  describe('format output tests', () => {
    beforeEach(() => {
      const testEvent = {
        attendees: [
          {
            displayName: 'Alice Johnson',
            email: 'alice@example.com',
            responseStatus: 'accepted',
          },
          {
            email: 'bob@example.com',
            responseStatus: 'tentative',
          },
        ],
        created: '2024-01-01T08:00:00.000Z',
        creator: {
          displayName: 'Event Creator',
          email: 'creator@example.com',
        },
        description: 'This is a detailed description of the test event',
        end: { dateTime: '2024-06-25T11:00:00+09:00' },
        htmlLink: 'https://calendar.google.com/event?eid=test123',
        id: 'test-event-123',
        location: 'Conference Room A, Building 1',
        organizer: {
          displayName: 'Meeting Organizer',
          email: 'organizer@example.com',
        },
        start: { dateTime: '2024-06-25T10:00:00+09:00' },
        status: 'confirmed',
        summary: 'Important Test Meeting',
        updated: '2024-01-02T09:30:00.000Z',
      };
      mockCalendarService.getEvent.resolves(testEvent);
    });

    it('should display event details in table format by default', async () => {
      const { stderr, stdout } = await runCommand('events show test-event-123');

      // Status messages should go to stderr
      expect(stderr).to.contain('Authenticating with Google Calendar...');
      expect(stderr).to.contain('Fetching event details...');

      // Event details should be in stdout
      expect(stdout).to.contain('=== Event Details ===');
      expect(stdout).to.contain('Title: Important Test Meeting');
      expect(stdout).to.contain('ID: test-event-123');
      expect(stdout).to.contain('Description: This is a detailed description of the test event');
      expect(stdout).to.contain('Location: Conference Room A, Building 1');
      expect(stdout).to.contain('Status: confirmed');
      expect(stdout).to.contain('Creator: Event Creator');
      expect(stdout).to.contain('Organizer: Meeting Organizer');
      expect(stdout).to.contain('Attendees:');
      expect(stdout).to.contain('1. Alice Johnson (accepted)');
      expect(stdout).to.contain('2. bob@example.com (tentative)');
      expect(stdout).to.contain('Google Calendar Link: https://calendar.google.com/event?eid=test123');

      // Status messages should NOT be in stdout
      expect(stdout).to.not.contain('Authenticating with Google Calendar...');
      expect(stdout).to.not.contain('Fetching event details...');
    });

    it('should output minified JSON with --format json', async () => {
      const { stderr, stdout } = await runCommand('events show test-event-123 --format json');

      // Status messages still go to stderr
      expect(stderr).to.contain('Authenticating with Google Calendar...');
      expect(stderr).to.contain('Fetching event details...');

      // Should be valid JSON
      expect(() => JSON.parse(stdout)).to.not.throw();
      const event = JSON.parse(stdout);

      // Verify event data
      expect(event).to.have.property('id', 'test-event-123');
      expect(event).to.have.property('summary', 'Important Test Meeting');
      expect(event).to.have.property('description', 'This is a detailed description of the test event');
      expect(event).to.have.property('location', 'Conference Room A, Building 1');
      expect(event).to.have.property('status', 'confirmed');
      expect(event.attendees).to.have.length(2);
      expect(event.creator).to.have.property('displayName', 'Event Creator');
      expect(event.organizer).to.have.property('displayName', 'Meeting Organizer');

      // Should be minified (no indentation)
      expect(stdout).to.not.contain('\n  ');
      expect(stdout.trim().split('\n')).to.have.length(1);

      // No status messages should contaminate JSON output
      expect(stdout).to.not.contain('Authenticating');
      expect(stdout).to.not.contain('Fetching');
    });

    it('should output formatted JSON with --format pretty-json', async () => {
      const { stderr, stdout } = await runCommand('events show test-event-123 --format pretty-json');

      // Status messages still go to stderr
      expect(stderr).to.contain('Authenticating with Google Calendar...');
      expect(stderr).to.contain('Fetching event details...');

      // Should be valid JSON
      expect(() => JSON.parse(stdout)).to.not.throw();
      const event = JSON.parse(stdout);

      // Verify event data
      expect(event).to.have.property('id', 'test-event-123');
      expect(event).to.have.property('summary', 'Important Test Meeting');
      expect(event).to.have.property('description', 'This is a detailed description of the test event');
      expect(event).to.have.property('location', 'Conference Room A, Building 1');
      expect(event.attendees).to.have.length(2);

      // Should be formatted (with indentation)
      expect(stdout).to.contain('\n  ');
      expect(stdout.trim().split('\n').length).to.be.greaterThan(1);

      // Should start with object bracket and proper indentation
      expect(stdout.trim()).to.match(/^{\s*\n\s+"/);

      // No status messages should contaminate JSON output
      expect(stdout).to.not.contain('Authenticating');
      expect(stdout).to.not.contain('Fetching');
    });

    it('should produce same data in json and pretty-json formats', async () => {
      const { stdout: jsonOutput } = await runCommand('events show test-event-123 --format json');
      const { stdout: prettyJsonOutput } = await runCommand('events show test-event-123 --format pretty-json');

      // Both should be valid JSON
      expect(() => JSON.parse(jsonOutput)).to.not.throw();
      expect(() => JSON.parse(prettyJsonOutput)).to.not.throw();

      // Parse both outputs
      const jsonEvent = JSON.parse(jsonOutput);
      const prettyJsonEvent = JSON.parse(prettyJsonOutput);

      // Should contain exactly the same data
      expect(jsonEvent).to.deep.equal(prettyJsonEvent);
      expect(jsonEvent).to.have.property('id', 'test-event-123');
      expect(prettyJsonEvent).to.have.property('summary', 'Important Test Meeting');

      // But the string representations should be different
      expect(jsonOutput).to.not.equal(prettyJsonOutput);

      // json should be minified, pretty-json should be formatted
      expect(jsonOutput).to.not.contain('\n  ');
      expect(prettyJsonOutput).to.contain('\n  ');
    });
  });

  describe('stdout/stderr separation', () => {
    beforeEach(() => {
      const simpleEvent = {
        end: { dateTime: '2024-06-25T11:00:00+09:00' },
        id: 'simple-event',
        start: { dateTime: '2024-06-25T10:00:00+09:00' },
        summary: 'Simple Event',
      };
      mockCalendarService.getEvent.resolves(simpleEvent);
    });

    it('should send status messages to stderr and results to stdout', async () => {
      const { stderr, stdout } = await runCommand('events show simple-event');

      // Status messages should be in stderr
      expect(stderr).to.contain('Authenticating with Google Calendar...');
      expect(stderr).to.contain('Fetching event details...');

      // Results should be in stdout
      expect(stdout).to.contain('=== Event Details ===');
      expect(stdout).to.contain('Simple Event');

      // Cross-contamination check
      expect(stdout).to.not.contain('Authenticating with Google Calendar...');
      expect(stderr).to.not.contain('=== Event Details ===');
    });

    it('should produce clean JSON output for piping', async () => {
      const { stdout } = await runCommand('events show simple-event --format json');

      // Should be parseable JSON without any extra text
      expect(() => JSON.parse(stdout)).to.not.throw();

      const event = JSON.parse(stdout);
      expect(event).to.be.an('object');
      expect(event).to.have.property('id', 'simple-event');

      // Should not contain any status messages
      expect(stdout).to.not.contain('Authenticating');
      expect(stdout).to.not.contain('Fetching');
    });
  });
});
