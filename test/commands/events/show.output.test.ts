import type { MockedObject } from 'vitest';

import { runCommand } from '@oclif/test';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { ICalendarService } from '../../../src/interfaces/services';

import { TestContainerFactory } from '../../test-utils/mock-factories';

describe('events show output', () => {
  let mockCalendarService: MockedObject<ICalendarService>;

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
      mockCalendarService.getEvent.mockResolvedValue(testEvent);
    });

    it('should display event details in table format by default', async () => {
      const { stderr, stdout } = await runCommand('events show test-event-123');

      // Status messages should go to stderr
      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching event details...');

      // Event details should be in stdout
      expect(stdout).toContain('=== Event Details ===');
      expect(stdout).toContain('Title: Important Test Meeting');
      expect(stdout).toContain('ID: test-event-123');
      expect(stdout).toContain('Description: This is a detailed description of the test event');
      expect(stdout).toContain('Location: Conference Room A, Building 1');
      expect(stdout).toContain('Status: confirmed');
      expect(stdout).toContain('Creator: Event Creator');
      expect(stdout).toContain('Organizer: Meeting Organizer');
      expect(stdout).toContain('Attendees:');
      expect(stdout).toContain('1. Alice Johnson (accepted)');
      expect(stdout).toContain('2. bob@example.com (tentative)');
      expect(stdout).toContain('Google Calendar Link: https://calendar.google.com/event?eid=test123');

      // Status messages should NOT be in stdout
      expect(stdout).not.toContain('Authenticating with Google Calendar...');
      expect(stdout).not.toContain('Fetching event details...');
    });

    it('should output minified JSON with --format json', async () => {
      const { stderr, stdout } = await runCommand('events show test-event-123 --format json');

      // Status messages still go to stderr
      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching event details...');

      // Should be valid JSON
      expect(() => JSON.parse(stdout)).not.toThrow();
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
      expect(stdout).not.toContain('\n  ');
      expect(stdout.trim().split('\n')).to.have.length(1);

      // No status messages should contaminate JSON output
      expect(stdout).not.toContain('Authenticating');
      expect(stdout).not.toContain('Fetching');
    });

    it('should output formatted JSON with --format pretty-json', async () => {
      const { stderr, stdout } = await runCommand('events show test-event-123 --format pretty-json');

      // Status messages still go to stderr
      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching event details...');

      // Should be valid JSON
      expect(() => JSON.parse(stdout)).not.toThrow();
      const event = JSON.parse(stdout);

      // Verify event data
      expect(event).to.have.property('id', 'test-event-123');
      expect(event).to.have.property('summary', 'Important Test Meeting');
      expect(event).to.have.property('description', 'This is a detailed description of the test event');
      expect(event).to.have.property('location', 'Conference Room A, Building 1');
      expect(event.attendees).to.have.length(2);

      // Should be formatted (with indentation)
      expect(stdout).toContain('\n  ');
      expect(stdout.trim().split('\n').length).to.be.greaterThan(1);

      // Should start with object bracket and proper indentation
      expect(stdout.trim()).to.match(/^{\s*\n\s+"/);

      // No status messages should contaminate JSON output
      expect(stdout).not.toContain('Authenticating');
      expect(stdout).not.toContain('Fetching');
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
      mockCalendarService.getEvent.mockResolvedValue(simpleEvent);
    });

    it('should send status messages to stderr and results to stdout', async () => {
      const { stderr, stdout } = await runCommand('events show simple-event');

      // Status messages should be in stderr
      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Fetching event details...');

      // Results should be in stdout
      expect(stdout).toContain('=== Event Details ===');
      expect(stdout).toContain('Simple Event');

      // Cross-contamination check
      expect(stdout).not.toContain('Authenticating with Google Calendar...');
      expect(stderr).not.toContain('=== Event Details ===');
    });

    it('should produce clean JSON output for piping', async () => {
      const { stdout } = await runCommand('events show simple-event --format json');

      // Should be parseable JSON without any extra text
      expect(() => JSON.parse(stdout)).not.toThrow();

      const event = JSON.parse(stdout);
      expect(event).to.be.an('object');
      expect(event).to.have.property('id', 'simple-event');

      // Should not contain any status messages
      expect(stdout).not.toContain('Authenticating');
      expect(stdout).not.toContain('Fetching');
    });
  });
});
