import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { createMockCalendarService } from '../../../src/test-utils/mock-factories';
import { TestContainerBuilder } from '../../../src/test-utils/test-container-builder';
import { TEST_EVENTS } from '../../../src/test-utils/test-data-defaults';
import { TestDataGenerators, testScenarios } from '../../../src/test-utils/test-helpers';

describe('events list integration (v2 pattern)', () => {
  let cleanup: () => void;

  afterEach(() => {
    if (cleanup) {
      cleanup();
    }
  });

  describe('stdout/stderr separation', () => {
    beforeEach(() => {
      const context = testScenarios.defaultState()
      cleanup = () => context.cleanup();
    });

    it('should separate status messages from event data', async () => {
      const { stderr, stdout } = await runCommand('events list');

      // Status messages should go to stderr
      expect(stderr).to.contain('Authenticating with Google Calendar...');
      expect(stderr).to.contain('Fetching events from primary...');

      // Event data should go to stdout
      expect(stdout).to.contain('Upcoming Events (2 found)');
      expect(stdout).to.contain('Mock Event 1');
      expect(stdout).to.contain('Mock Event 2');

      // Status messages should NOT be in stdout
      expect(stdout).to.not.contain('Authenticating with Google Calendar...');
      expect(stdout).to.not.contain('Fetching events from');
    });

    it('should produce clean JSON output for piping', async () => {
      const { stderr, stdout } = await runCommand('events list --format json');

      // Status messages still go to stderr
      expect(stderr).to.contain('Authenticating with Google Calendar...');
      expect(stderr).to.contain('Fetching events from primary...');

      // stdout should contain only clean JSON
      expect(() => JSON.parse(stdout)).to.not.throw();
      const events = JSON.parse(stdout);
      expect(Array.isArray(events)).to.be.true;
      expect(events).to.have.length(2);
      expect(events[0]).to.have.property('summary', 'Mock Event 1');
      expect(events[1]).to.have.property('summary', 'Mock Event 2');

      // No status messages should contaminate JSON output
      expect(stdout).to.not.contain('Authenticating');
      expect(stdout).to.not.contain('Fetching');
    });
  });

  describe('different event scenarios', () => {
    it('should handle events with various time formats', async () => {
      // Using explicit test setup with custom events
      const context = new TestContainerBuilder()
        .withMockCalendarService(createMockCalendarService({
          events: [
            TEST_EVENTS.DETAILED_EVENT,
            TEST_EVENTS.ALL_DAY_EVENT,
            TEST_EVENTS.NO_TITLE_EVENT,
            TEST_EVENTS.LONG_DESCRIPTION_EVENT,
          ],
        }))
        .withDefaultMocks()
        .activate();
      
      cleanup = () => context.cleanup();

      const { stdout } = await runCommand('events list');

      expect(stdout).to.contain('Upcoming Events (4 found)');
      expect(stdout).to.contain('1. Meeting with client');
      expect(stdout).to.contain('Conference Room A');
      expect(stdout).to.contain('2. Company Holiday');
      expect(stdout).to.contain('All day');
      expect(stdout).to.contain('3. (No title)');
      expect(stdout).to.contain('4. Event with long description');
      expect(stdout).to.contain('This is a very long description that exceeds 100 characters and should be truncated in the table vie...');
    });

    it('should handle empty events list', async () => {
      const context = testScenarios.emptyState()
      cleanup = () => context.cleanup();

      const { stdout } = await runCommand('events list');

      expect(stdout).to.contain('No upcoming events found.');
    });

    it('should handle events with Unicode characters', async () => {
      const context = testScenarios.unicodeState()
      cleanup = () => context.cleanup();

      const { stdout } = await runCommand('events list');

      expect(stdout).to.contain('会議 📅');
      expect(stdout).to.contain('東京オフィス 🏢');
      expect(stdout).to.contain('重要な会議です。資料を準備してください。');
      expect(stdout).to.contain('🎉 Birthday Party 🎂');
      expect(stdout).to.contain('🏠 Home');
      expect(stdout).to.contain('Celebrating with 🍰 and 🎈');
      expect(stdout).to.contain('Besprechung über Änderungen');
      expect(stdout).to.contain('München Büro');
    });
  });

  describe('flag parameter handling', () => {
    it('should respect max-results flag', async () => {
      const context = testScenarios.largeDatasetState(15)
      cleanup = () => context.cleanup();

      const { stdout } = await runCommand('events list --max-results 5');

      expect(stdout).to.contain('Upcoming Events (5 found)');
      expect(stdout).to.contain('1. Generated Event 1');
      expect(stdout).to.contain('5. Generated Event 5');
      expect(stdout).to.not.contain('6. Generated Event 6');
    });

    it('should respect max-results short flag', async () => {
      const context = testScenarios.largeDatasetState(15)
      cleanup = () => context.cleanup();

      const { stdout } = await runCommand('events list -n 3');

      expect(stdout).to.contain('Upcoming Events (3 found)');
      expect(stdout).to.contain('1. Generated Event 1');
      expect(stdout).to.contain('3. Generated Event 3');
      expect(stdout).to.not.contain('4. Generated Event 4');
    });

    it('should use default max-results when not specified', async () => {
      const context = testScenarios.largeDatasetState(15)
      cleanup = () => context.cleanup();

      const { stdout } = await runCommand('events list');

      // Default should be 10, but we have 15 events, so should see 10
      expect(stdout).to.contain('Upcoming Events (10 found)');
      expect(stdout).to.contain('10. Generated Event 10');
      expect(stdout).to.not.contain('11. Generated Event 11');
    });
  });

  describe('format consistency', () => {
    beforeEach(() => {
      // Using test data generator for consistency testing
      const context = new TestContainerBuilder()
        .withMockCalendarService(createMockCalendarService({
          events: TestDataGenerators.eventsWithAttendees(),
        }))
        .withDefaultMocks()
        .activate();
      
      cleanup = () => context.cleanup();
    });

    it('should include same events in both table and JSON formats', async () => {
      const { stdout: tableOutput } = await runCommand('events list --format table');
      const { stdout: jsonOutput } = await runCommand('events list --format json');

      // Parse JSON output
      const events = JSON.parse(jsonOutput);
      expect(events).to.have.length(2);

      // Verify key information appears in both formats
      const firstEvent = events.find((event: any) => event.id === 'test-event-1'); // eslint-disable-line @typescript-eslint/no-explicit-any
      const secondEvent = events.find((event: any) => event.id === 'test-event-2'); // eslint-disable-line @typescript-eslint/no-explicit-any

      expect(firstEvent).to.exist;
      expect(secondEvent).to.exist;

      // Check table format contains the same information
      expect(tableOutput).to.contain('Test Meeting');
      expect(tableOutput).to.contain('All Day Event');
      expect(tableOutput).to.contain('Meeting Room 1');
      expect(tableOutput).to.contain('Important test meeting');
      expect(tableOutput).to.contain('All day');

      // Verify JSON contains complete data
      expect(firstEvent.summary).to.equal('Test Meeting');
      expect(firstEvent.location).to.equal('Meeting Room 1');
      expect(firstEvent.description).to.equal('Important test meeting');
      expect(firstEvent.attendees).to.have.length(2);

      expect(secondEvent.summary).to.equal('All Day Event');
      expect(secondEvent.start.date).to.equal('2024-06-26');

      // Should be minified JSON (no indentation)
      expect(jsonOutput).to.not.contain('\n  ');
      expect(jsonOutput.trim().split('\n')).to.have.length(1);
    });

    it('should produce valid JSON even with complex event data', async () => {
      // Override with complex events for this specific test
      const context = new TestContainerBuilder()
        .withMockCalendarService(createMockCalendarService({
          events: TestDataGenerators.complexEvents(),
        }))
        .withDefaultMocks()
        .activate();
      
      // Clean up previous context and set new one
      if (cleanup) cleanup();
      cleanup = () => context.cleanup();

      const { stdout } = await runCommand('events list --format json');

      expect(() => JSON.parse(stdout)).to.not.throw();
      const events = JSON.parse(stdout);
      expect(events).to.have.length(1);
      expect(events[0].summary).to.contain('quotes');
      expect(events[0].description).to.contain('newlines');
      expect(events[0].location).to.contain('special');
    });
  });

  describe('--quiet flag behavior', () => {
    beforeEach(() => {
      const context = testScenarios.defaultState()
      cleanup = () => context.cleanup();
    });

    it('should suppress status messages with --quiet flag', async () => {
      const { stderr, stdout } = await runCommand('events list --quiet');

      // Status messages should be suppressed
      expect(stderr).to.not.contain('Authenticating with Google Calendar...');
      expect(stderr).to.not.contain('Fetching events from');

      // But results should still be shown
      expect(stdout).to.contain('Upcoming Events (2 found)');
      expect(stdout).to.contain('Mock Event 1');
    });

    it('should suppress status messages in JSON format with --quiet flag', async () => {
      const { stderr, stdout } = await runCommand('events list --format json --quiet');

      // Status messages should be suppressed
      expect(stderr).to.not.contain('Authenticating with Google Calendar...');
      expect(stderr).to.not.contain('Fetching events from');

      // JSON output should still be clean and valid
      expect(() => JSON.parse(stdout)).to.not.throw();
      const events = JSON.parse(stdout);
      expect(events).to.have.length(2);
    });
  });

  describe('error handling scenarios', () => {
    it('should handle authentication errors gracefully', async () => {
      const context = testScenarios.authErrorState()
      cleanup = () => context.cleanup();

      try {
        await runCommand('events list');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(String(error)).to.contain('Authentication failed');
      }
    });

    it('should handle network errors gracefully', async () => {
      const context = testScenarios.networkErrorState()
      cleanup = () => context.cleanup();

      try {
        await runCommand('events list');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(String(error)).to.contain('Network error');
      }
    });
  });
});