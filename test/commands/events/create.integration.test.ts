import { runCommand } from '@oclif/test';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TestContainerFactory } from '../../test-utils/mock-factories';

describe('events create integration', () => {
  beforeEach(() => {
    TestContainerFactory.create();
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  describe('basic event creation', () => {
    it('should create event with required fields', async () => {
      const { stderr, stdout } = await runCommand('events create "Test Meeting" --start "2024-06-25T14:00:00"');

      // Status messages should go to stderr
      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Creating event...');

      // Success message and event details go to stdout
      expect(stdout).toContain('Event created successfully!');
      expect(stdout).toContain('Title: Test Meeting');
      expect(stdout).toContain('ID: mock-event-');
      expect(stdout).toContain('Start:');
      expect(stdout).toContain('End:');

      // Status messages should NOT be in stdout
      expect(stdout).not.toContain('Authenticating');
      expect(stdout).not.toContain('Creating event...');
    });

    it('should create event with end time', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --end "2024-06-25T15:30:00"',
      );

      expect(stdout).toContain('Event created successfully!');
      expect(stdout).toContain('Title: Meeting');
      expect(stdout).toContain('Start:');
      expect(stdout).toContain('End:');
    });

    it('should create event with duration', async () => {
      const { stdout } = await runCommand('events create "Meeting" --start "2024-06-25T14:00:00" --duration 90');

      expect(stdout).toContain('Event created successfully!');
      expect(stdout).toContain('Title: Meeting');
    });

    it('should create all-day event', async () => {
      const { stdout } = await runCommand('events create "Holiday" --start "2024-06-25" --all-day');

      expect(stdout).toContain('Event created successfully!');
      expect(stdout).toContain('Title: Holiday');
      expect(stdout).toContain('Date:');
      expect(stdout).not.toContain('Start:');
      expect(stdout).not.toContain('End:');
    });
  });

  describe('event creation with optional fields', () => {
    it('should create event with location', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --location "Conference Room A"',
      );

      expect(stdout).toContain('Event created successfully!');
      expect(stdout).toContain('Title: Meeting');
      expect(stdout).toContain('Location: Conference Room A');
    });

    it('should create event with description', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --description "Important project discussion"',
      );

      expect(stdout).toContain('Event created successfully!');
      expect(stdout).toContain('Title: Meeting');
    });

    it('should create event with attendees', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --attendees "alice@example.com,bob@example.com"',
      );

      expect(stdout).toContain('Event created successfully!');
      expect(stdout).toContain('Title: Meeting');
    });

    it('should create event with all optional fields', async () => {
      const { stdout } = await runCommand(
        'events create "Team Meeting" --start "2024-06-25T14:00:00" --end "2024-06-25T15:00:00" --location "Room A" --description "Sprint planning" --attendees "alice@example.com,bob@example.com" --calendar "work@company.com"',
      );

      expect(stdout).toContain('Event created successfully!');
      expect(stdout).toContain('Title: Team Meeting');
      expect(stdout).toContain('Location: Room A');
    });
  });

  describe('JSON output format', () => {
    it('should produce clean JSON output', async () => {
      const { stderr, stdout } = await runCommand(
        'events create "Test Event" --start "2024-06-25T14:00:00" --format json',
      );

      // Status messages still go to stderr
      expect(stderr).toContain('Authenticating with Google Calendar...');
      expect(stderr).toContain('Creating event...');

      // stdout should contain only clean JSON
      expect(() => JSON.parse(stdout)).not.toThrow();
      const event = JSON.parse(stdout);
      expect(event).toHaveProperty('summary', 'Test Event');
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('start');
      expect(event).toHaveProperty('end');

      // No status messages should contaminate JSON output
      expect(stdout).not.toContain('Authenticating');
      expect(stdout).not.toContain('Creating');
      expect(stdout).not.toContain('Event created successfully');
    });

    it('should produce formatted JSON with --format pretty-json', async () => {
      const { stdout } = await runCommand(
        'events create "Test Event" --start "2024-06-25T14:00:00" --format pretty-json',
      );

      // Should be valid JSON
      expect(() => JSON.parse(stdout)).not.toThrow();
      const event = JSON.parse(stdout);
      expect(event).toHaveProperty('summary', 'Test Event');

      // Should be formatted JSON (with indentation)
      expect(stdout).toContain('\n  ');
      expect(stdout.trim().split('\n').length).toBeGreaterThan(1);
    });

    it('should include all event data in JSON format', async () => {
      const { stdout } = await runCommand(
        'events create "Full Event" --start "2024-06-25T14:00:00" --end "2024-06-25T15:00:00" --location "Meeting Room" --description "Detailed description" --attendees "user@example.com" --format json',
      );

      const event = JSON.parse(stdout);
      expect(event.summary).toBe('Full Event');
      expect(event.location).toBe('Meeting Room');
      expect(event.description).toBe('Detailed description');
      expect(event.attendees).toHaveLength(1);
      expect(event.attendees[0].email).toBe('user@example.com');
    });
  });

  describe('calendar selection', () => {
    it('should create event in primary calendar by default', async () => {
      const { stdout } = await runCommand('events create "Test Event" --start "2024-06-25T14:00:00"');

      expect(stdout).toContain('Event created successfully!');
    });

    it('should create event in specified calendar', async () => {
      const { stdout } = await runCommand(
        'events create "Test Event" --start "2024-06-25T14:00:00" --calendar "work@company.com"',
      );

      expect(stdout).toContain('Event created successfully!');
    });

    it('should accept short flag for calendar', async () => {
      const { stdout } = await runCommand(
        'events create "Test Event" --start "2024-06-25T14:00:00" -c "personal@gmail.com"',
      );

      expect(stdout).toContain('Event created successfully!');
    });
  });

  describe('time format handling', () => {
    it('should handle ISO datetime format', async () => {
      const { stdout } = await runCommand('events create "Meeting" --start "2024-06-25T14:00:00Z"');

      expect(stdout).toContain('Event created successfully!');
    });

    it('should handle local datetime format', async () => {
      const { stdout } = await runCommand('events create "Meeting" --start "2024-06-25T14:00:00"');

      expect(stdout).toContain('Event created successfully!');
    });

    it('should handle date-only format for all-day events', async () => {
      const { stdout } = await runCommand('events create "Holiday" --start "2024-06-25" --all-day');

      expect(stdout).toContain('Event created successfully!');
      expect(stdout).toContain('Date:');
    });
  });

  describe('special characters and Unicode', () => {
    it('should handle Unicode characters in event title', async () => {
      const { stdout } = await runCommand('events create "会議 📅" --start "2024-06-25T14:00:00"');

      expect(stdout).toContain('Event created successfully!');
      expect(stdout).toContain('Title: 会議 📅');
    });

    it('should handle Unicode in location and description', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --location "東京オフィス 🏢" --description "重要な会議です"',
      );

      expect(stdout).toContain('Event created successfully!');
      expect(stdout).toContain('Location: 東京オフィス 🏢');
    });

    it('should handle special characters in attendee emails', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --attendees "user+tag@example.com,another.user@example-domain.com"',
      );

      expect(stdout).toContain('Event created successfully!');
    });
  });

  describe('attendee parsing', () => {
    it('should parse single attendee', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --attendees "user@example.com" --format json',
      );

      const event = JSON.parse(stdout);
      expect(event.attendees).toHaveLength(1);
      expect(event.attendees[0].email).toBe('user@example.com');
    });

    it('should parse multiple attendees', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --attendees "alice@example.com,bob@example.com,charlie@example.com" --format json',
      );

      const event = JSON.parse(stdout);
      expect(event.attendees).toHaveLength(3);
      expect(event.attendees[0].email).toBe('alice@example.com');
      expect(event.attendees[1].email).toBe('bob@example.com');
      expect(event.attendees[2].email).toBe('charlie@example.com');
    });

    it('should handle attendees with spaces around commas', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --attendees "alice@example.com, bob@example.com , charlie@example.com" --format json',
      );

      const event = JSON.parse(stdout);
      expect(event.attendees).toHaveLength(3);
      expect(event.attendees[0].email).toBe('alice@example.com');
      expect(event.attendees[1].email).toBe('bob@example.com');
      expect(event.attendees[2].email).toBe('charlie@example.com');
    });
  });

  describe('--quiet flag behavior', () => {
    it('should suppress status messages with --quiet flag', async () => {
      const { stderr, stdout } = await runCommand('events create "Test Event" --start "2024-06-25T14:00:00" --quiet');

      // Status messages should be suppressed
      expect(stderr).not.toContain('Authenticating with Google Calendar...');
      expect(stderr).not.toContain('Creating event...');

      // But results should still be shown
      expect(stdout).toContain('Event created successfully!');
      expect(stdout).toContain('Title: Test Event');
    });

    it('should suppress status messages in JSON format with --quiet flag', async () => {
      const { stderr, stdout } = await runCommand(
        'events create "Test Event" --start "2024-06-25T14:00:00" --format json --quiet',
      );

      // Status messages should be suppressed
      expect(stderr).not.toContain('Authenticating with Google Calendar...');
      expect(stderr).not.toContain('Creating event...');

      // JSON output should still be clean and valid
      expect(() => JSON.parse(stdout)).not.toThrow();
      const event = JSON.parse(stdout);
      expect(event.summary).toBe('Test Event');
    });
  });

  describe('edge cases and error scenarios', () => {
    it('should handle events with no title gracefully in JSON', async () => {
      const { stdout } = await runCommand('events create "" --start "2024-06-25T14:00:00" --format json');

      const event = JSON.parse(stdout);
      expect(event.summary).toBe('');
    });

    it('should handle very long event titles', async () => {
      const longTitle = 'A'.repeat(500);
      const { stdout } = await runCommand(`events create "${longTitle}" --start "2024-06-25T14:00:00"`);

      expect(stdout).toContain('Event created successfully!');
      expect(stdout).toContain(`Title: ${longTitle}`);
    });

    it('should handle very long descriptions', async () => {
      const longDescription = 'Description '.repeat(100);
      const { stdout } = await runCommand(
        `events create "Meeting" --start "2024-06-25T14:00:00" --description "${longDescription}"`,
      );

      expect(stdout).toContain('Event created successfully!');
    });

    it('should handle events with empty location', async () => {
      const { stdout } = await runCommand('events create "Meeting" --start "2024-06-25T14:00:00" --location ""');

      expect(stdout).toContain('Event created successfully!');
      expect(stdout).not.toContain('Location:');
    });
  });

  describe('short flag aliases', () => {
    it('should accept all short flags', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" -s "2024-06-25T14:00:00" -e "2024-06-25T15:00:00" -c primary -l "Room A" -f json',
      );

      expect(() => JSON.parse(stdout)).not.toThrow();
      const event = JSON.parse(stdout);
      expect(event.summary).toBe('Meeting');
      expect(event.location).toBe('Room A');
    });

    it('should accept duration short flag', async () => {
      const { stdout } = await runCommand('events create "Meeting" -s "2024-06-25T14:00:00" -d 120');

      expect(stdout).toContain('Event created successfully!');
    });
  });

  describe('send-updates flag', () => {
    it('should accept valid send-updates values', async () => {
      const { stdout: allOutput } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --send-updates all',
      );
      const { stdout: externalOutput } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --send-updates externalOnly',
      );
      const { stdout: noneOutput } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --send-updates none',
      );

      expect(allOutput).toContain('Event created successfully!');
      expect(externalOutput).toContain('Event created successfully!');
      expect(noneOutput).toContain('Event created successfully!');
    });

    it('should default to none for send-updates', async () => {
      const { stdout } = await runCommand('events create "Meeting" --start "2024-06-25T14:00:00"');

      expect(stdout).toContain('Event created successfully!');
    });
  });
});
