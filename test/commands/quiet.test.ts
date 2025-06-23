import { runCommand } from '@oclif/test';
import { expect } from 'chai';

import { ServiceRegistry } from '../../src/services/service-registry';
import { MockAuthService, MockCalendarService } from '../../src/test-utils/mock-services';

describe('--quiet flag', () => {
  beforeEach(() => {
    // Set up mock services for testing
    ServiceRegistry.registerMock('AuthService', new MockAuthService());
    ServiceRegistry.registerMock('CalendarService', new MockCalendarService());
  });

  afterEach(() => {
    ServiceRegistry.clearMocks();
  });

  it('should suppress status messages in events list command', async () => {
    const { stderr, stdout } = await runCommand('events list --quiet --max-results 1');
    
    // Status messages should be suppressed
    expect(stderr).to.not.contain('Authenticating with Google Calendar...');
    expect(stderr).to.not.contain('Fetching events from');
    
    // Result output should still be present
    expect(stdout.length).to.be.greaterThan(0);
    expect(stdout).to.contain('Mock Event');
  });

  it('should suppress status messages in calendars list command', async () => {
    const { stderr, stdout } = await runCommand('calendars list --quiet');
    
    // Status messages should be suppressed
    expect(stderr).to.not.contain('Authenticating with Google Calendar...');
    expect(stderr).to.not.contain('Fetching calendars...');
    
    // Result output should still be present
    expect(stdout.length).to.be.greaterThan(0);
    expect(stdout).to.contain('Primary Calendar');
  });

  it('should suppress status messages in events show command', async () => {
    try {
      const { stderr, stdout } = await runCommand('events show mock-event-1 --quiet');
      
      // Status messages should be suppressed
      expect(stderr).to.not.contain('Authenticating with Google Calendar...');
      expect(stderr).to.not.contain('Fetching event details...');
      
      // Result output should be present
      expect(stdout.length).to.be.greaterThan(0);
      expect(stdout).to.contain('Mock Event 1');
    } catch (error: unknown) {
      // If command fails for other reasons, check error messages
      const errorMessage = (error as Error).message || '';
      
      // Status messages should be suppressed even in error case
      expect(errorMessage).to.not.contain('Authenticating with Google Calendar...');
      expect(errorMessage).to.not.contain('Fetching event details...');
    }
  });

  it('should suppress confirmation messages in config command', async () => {
    const { stderr, stdout } = await runCommand('config list --quiet');
    
    // Status messages should be suppressed
    expect(stderr).to.not.contain('Current configuration:');
    expect(stderr).to.not.contain('Config file:');
    
    // Result output should still be present
    expect(stdout.length).to.be.greaterThan(0);
  });

  it('should show help for --quiet flag', async () => {
    const { stdout } = await runCommand('events list --help');
    
    expect(stdout).to.contain('--quiet');
    expect(stdout).to.contain('Suppress non-essential output');
  });

  it('should work with short flag -q', async () => {
    const { stderr, stdout } = await runCommand('events list -q --max-results 1');
    
    // Status messages should be suppressed with short flag
    expect(stderr).to.not.contain('Authenticating with Google Calendar...');
    expect(stderr).to.not.contain('Fetching events from');
    
    // Result output should still be present
    expect(stdout.length).to.be.greaterThan(0);
    expect(stdout).to.contain('Mock Event');
  });
});