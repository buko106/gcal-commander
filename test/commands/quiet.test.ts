import { runCommand } from '@oclif/test';
import { expect } from 'chai';

describe('--quiet flag', () => {
  it('should suppress status messages in events list command', async () => {
    const { stderr, stdout } = await runCommand('events list --quiet --max-results 1');
    
    // Status messages should be suppressed
    expect(stderr).to.not.contain('Authenticating with Google Calendar...');
    expect(stderr).to.not.contain('Fetching events from');
    
    // Result output should still be present (or "No upcoming events found")
    expect(stdout.length).to.be.greaterThan(0);
  });

  it('should suppress status messages in calendars list command', async () => {
    const { stderr, stdout } = await runCommand('calendars list --quiet');
    
    // Status messages should be suppressed
    expect(stderr).to.not.contain('Authenticating with Google Calendar...');
    expect(stderr).to.not.contain('Fetching calendars...');
    
    // Result output should still be present
    expect(stdout.length).to.be.greaterThan(0);
  });

  it('should suppress status messages in events show command', async () => {
    try {
      await runCommand('events show test-event-id --quiet');
    } catch (error: unknown) {
      // Command should fail due to invalid event ID
      const stderr = (error as Error).message || '';
      
      // Status messages should be suppressed
      expect(stderr).to.not.contain('Authenticating with Google Calendar...');
      expect(stderr).to.not.contain('Fetching event details...');
      
      // Error messages should still be present for invalid event ID
      expect(stderr.length).to.be.greaterThan(0);
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
    const { stderr } = await runCommand('events list -q --max-results 1');
    
    // Status messages should be suppressed with short flag
    expect(stderr).to.not.contain('Authenticating with Google Calendar...');
    expect(stderr).to.not.contain('Fetching events from');
  });
});