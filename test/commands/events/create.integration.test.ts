import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { TestContainerFactory } from '../../../src/test-utils/mock-factories/test-container-factory';

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
      expect(stderr).to.contain('Authenticating with Google Calendar...');
      expect(stderr).to.contain('Creating event...');

      // Success message and event details go to stdout
      expect(stdout).to.contain('Event created successfully!');
      expect(stdout).to.contain('Title: Test Meeting');
      expect(stdout).to.contain('ID: mock-event-');
      expect(stdout).to.contain('Start:');
      expect(stdout).to.contain('End:');

      // Status messages should NOT be in stdout
      expect(stdout).to.not.contain('Authenticating');
      expect(stdout).to.not.contain('Creating event...');
    });

    it('should create event with end time', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --end "2024-06-25T15:30:00"',
      );

      expect(stdout).to.contain('Event created successfully!');
      expect(stdout).to.contain('Title: Meeting');
      expect(stdout).to.contain('Start:');
      expect(stdout).to.contain('End:');
    });

    it('should create event with duration', async () => {
      const { stdout } = await runCommand('events create "Meeting" --start "2024-06-25T14:00:00" --duration 90');

      expect(stdout).to.contain('Event created successfully!');
      expect(stdout).to.contain('Title: Meeting');
    });

    it('should create all-day event', async () => {
      const { stdout } = await runCommand('events create "Holiday" --start "2024-06-25" --all-day');

      expect(stdout).to.contain('Event created successfully!');
      expect(stdout).to.contain('Title: Holiday');
      expect(stdout).to.contain('Date:');
      expect(stdout).to.not.contain('Start:');
      expect(stdout).to.not.contain('End:');
    });
  });

  describe('event creation with optional fields', () => {
    it('should create event with location', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --location "Conference Room A"',
      );

      expect(stdout).to.contain('Event created successfully!');
      expect(stdout).to.contain('Title: Meeting');
      expect(stdout).to.contain('Location: Conference Room A');
    });

    it('should create event with description', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --description "Important project discussion"',
      );

      expect(stdout).to.contain('Event created successfully!');
      expect(stdout).to.contain('Title: Meeting');
    });

    it('should create event with attendees', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --attendees "alice@example.com,bob@example.com"',
      );

      expect(stdout).to.contain('Event created successfully!');
      expect(stdout).to.contain('Title: Meeting');
    });

    it('should create event with all optional fields', async () => {
      const { stdout } = await runCommand(
        'events create "Team Meeting" --start "2024-06-25T14:00:00" --end "2024-06-25T15:00:00" --location "Room A" --description "Sprint planning" --attendees "alice@example.com,bob@example.com" --calendar "work@company.com"',
      );

      expect(stdout).to.contain('Event created successfully!');
      expect(stdout).to.contain('Title: Team Meeting');
      expect(stdout).to.contain('Location: Room A');
    });
  });

  describe('JSON output format', () => {
    it('should produce clean JSON output', async () => {
      const { stderr, stdout } = await runCommand(
        'events create "Test Event" --start "2024-06-25T14:00:00" --format json',
      );

      // Status messages still go to stderr
      expect(stderr).to.contain('Authenticating with Google Calendar...');
      expect(stderr).to.contain('Creating event...');

      // stdout should contain only clean JSON
      expect(() => JSON.parse(stdout)).to.not.throw();
      const event = JSON.parse(stdout);
      expect(event).to.have.property('summary', 'Test Event');
      expect(event).to.have.property('id');
      expect(event).to.have.property('start');
      expect(event).to.have.property('end');

      // No status messages should contaminate JSON output
      expect(stdout).to.not.contain('Authenticating');
      expect(stdout).to.not.contain('Creating');
      expect(stdout).to.not.contain('Event created successfully');
    });

    it('should produce formatted JSON with --format pretty-json', async () => {
      const { stdout } = await runCommand(
        'events create "Test Event" --start "2024-06-25T14:00:00" --format pretty-json',
      );

      // Should be valid JSON
      expect(() => JSON.parse(stdout)).to.not.throw();
      const event = JSON.parse(stdout);
      expect(event).to.have.property('summary', 'Test Event');

      // Should be formatted JSON (with indentation)
      expect(stdout).to.contain('\n  ');
      expect(stdout.trim().split('\n').length).to.be.greaterThan(1);
    });

    it('should include all event data in JSON format', async () => {
      const { stdout } = await runCommand(
        'events create "Full Event" --start "2024-06-25T14:00:00" --end "2024-06-25T15:00:00" --location "Meeting Room" --description "Detailed description" --attendees "user@example.com" --format json',
      );

      const event = JSON.parse(stdout);
      expect(event.summary).to.equal('Full Event');
      expect(event.location).to.equal('Meeting Room');
      expect(event.description).to.equal('Detailed description');
      expect(event.attendees).to.have.length(1);
      expect(event.attendees[0].email).to.equal('user@example.com');
    });
  });

  describe('calendar selection', () => {
    it('should create event in primary calendar by default', async () => {
      const { stdout } = await runCommand('events create "Test Event" --start "2024-06-25T14:00:00"');

      expect(stdout).to.contain('Event created successfully!');
    });

    it('should create event in specified calendar', async () => {
      const { stdout } = await runCommand(
        'events create "Test Event" --start "2024-06-25T14:00:00" --calendar "work@company.com"',
      );

      expect(stdout).to.contain('Event created successfully!');
    });

    it('should accept short flag for calendar', async () => {
      const { stdout } = await runCommand(
        'events create "Test Event" --start "2024-06-25T14:00:00" -c "personal@gmail.com"',
      );

      expect(stdout).to.contain('Event created successfully!');
    });
  });

  describe('time format handling', () => {
    it('should handle ISO datetime format', async () => {
      const { stdout } = await runCommand('events create "Meeting" --start "2024-06-25T14:00:00Z"');

      expect(stdout).to.contain('Event created successfully!');
    });

    it('should handle local datetime format', async () => {
      const { stdout } = await runCommand('events create "Meeting" --start "2024-06-25T14:00:00"');

      expect(stdout).to.contain('Event created successfully!');
    });

    it('should handle date-only format for all-day events', async () => {
      const { stdout } = await runCommand('events create "Holiday" --start "2024-06-25" --all-day');

      expect(stdout).to.contain('Event created successfully!');
      expect(stdout).to.contain('Date:');
    });
  });

  describe('special characters and Unicode', () => {
    it('should handle Unicode characters in event title', async () => {
      const { stdout } = await runCommand('events create "会議 📅" --start "2024-06-25T14:00:00"');

      expect(stdout).to.contain('Event created successfully!');
      expect(stdout).to.contain('Title: 会議 📅');
    });

    it('should handle Unicode in location and description', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --location "東京オフィス 🏢" --description "重要な会議です"',
      );

      expect(stdout).to.contain('Event created successfully!');
      expect(stdout).to.contain('Location: 東京オフィス 🏢');
    });

    it('should handle special characters in attendee emails', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --attendees "user+tag@example.com,another.user@example-domain.com"',
      );

      expect(stdout).to.contain('Event created successfully!');
    });
  });

  describe('attendee parsing', () => {
    it('should parse single attendee', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --attendees "user@example.com" --format json',
      );

      const event = JSON.parse(stdout);
      expect(event.attendees).to.have.length(1);
      expect(event.attendees[0].email).to.equal('user@example.com');
    });

    it('should parse multiple attendees', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --attendees "alice@example.com,bob@example.com,charlie@example.com" --format json',
      );

      const event = JSON.parse(stdout);
      expect(event.attendees).to.have.length(3);
      expect(event.attendees[0].email).to.equal('alice@example.com');
      expect(event.attendees[1].email).to.equal('bob@example.com');
      expect(event.attendees[2].email).to.equal('charlie@example.com');
    });

    it('should handle attendees with spaces around commas', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" --start "2024-06-25T14:00:00" --attendees "alice@example.com, bob@example.com , charlie@example.com" --format json',
      );

      const event = JSON.parse(stdout);
      expect(event.attendees).to.have.length(3);
      expect(event.attendees[0].email).to.equal('alice@example.com');
      expect(event.attendees[1].email).to.equal('bob@example.com');
      expect(event.attendees[2].email).to.equal('charlie@example.com');
    });
  });

  describe('--quiet flag behavior', () => {
    it('should suppress status messages with --quiet flag', async () => {
      const { stderr, stdout } = await runCommand('events create "Test Event" --start "2024-06-25T14:00:00" --quiet');

      // Status messages should be suppressed
      expect(stderr).to.not.contain('Authenticating with Google Calendar...');
      expect(stderr).to.not.contain('Creating event...');

      // But results should still be shown
      expect(stdout).to.contain('Event created successfully!');
      expect(stdout).to.contain('Title: Test Event');
    });

    it('should suppress status messages in JSON format with --quiet flag', async () => {
      const { stderr, stdout } = await runCommand(
        'events create "Test Event" --start "2024-06-25T14:00:00" --format json --quiet',
      );

      // Status messages should be suppressed
      expect(stderr).to.not.contain('Authenticating with Google Calendar...');
      expect(stderr).to.not.contain('Creating event...');

      // JSON output should still be clean and valid
      expect(() => JSON.parse(stdout)).to.not.throw();
      const event = JSON.parse(stdout);
      expect(event.summary).to.equal('Test Event');
    });
  });

  describe('edge cases and error scenarios', () => {
    it('should handle events with no title gracefully in JSON', async () => {
      const { stdout } = await runCommand('events create "" --start "2024-06-25T14:00:00" --format json');

      const event = JSON.parse(stdout);
      expect(event.summary).to.equal('');
    });

    it('should handle very long event titles', async () => {
      const longTitle = 'A'.repeat(500);
      const { stdout } = await runCommand(`events create "${longTitle}" --start "2024-06-25T14:00:00"`);

      expect(stdout).to.contain('Event created successfully!');
      expect(stdout).to.contain(`Title: ${longTitle}`);
    });

    it('should handle very long descriptions', async () => {
      const longDescription = 'Description '.repeat(100);
      const { stdout } = await runCommand(
        `events create "Meeting" --start "2024-06-25T14:00:00" --description "${longDescription}"`,
      );

      expect(stdout).to.contain('Event created successfully!');
    });

    it('should handle events with empty location', async () => {
      const { stdout } = await runCommand('events create "Meeting" --start "2024-06-25T14:00:00" --location ""');

      expect(stdout).to.contain('Event created successfully!');
      expect(stdout).to.not.contain('Location:');
    });
  });

  describe('short flag aliases', () => {
    it('should accept all short flags', async () => {
      const { stdout } = await runCommand(
        'events create "Meeting" -s "2024-06-25T14:00:00" -e "2024-06-25T15:00:00" -c primary -l "Room A" -f json',
      );

      expect(() => JSON.parse(stdout)).to.not.throw();
      const event = JSON.parse(stdout);
      expect(event.summary).to.equal('Meeting');
      expect(event.location).to.equal('Room A');
    });

    it('should accept duration short flag', async () => {
      const { stdout } = await runCommand('events create "Meeting" -s "2024-06-25T14:00:00" -d 120');

      expect(stdout).to.contain('Event created successfully!');
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

      expect(allOutput).to.contain('Event created successfully!');
      expect(externalOutput).to.contain('Event created successfully!');
      expect(noneOutput).to.contain('Event created successfully!');
    });

    it('should default to none for send-updates', async () => {
      const { stdout } = await runCommand('events create "Meeting" --start "2024-06-25T14:00:00"');

      expect(stdout).to.contain('Event created successfully!');
    });
  });
});
