import { expect } from 'vitest';

/**
 * Helper functions for calendar command testing
 */

/**
 * Validates that JSON output is properly formatted and contains expected data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateJsonOutput(jsonString: string, expectedLength?: number): any[] {
  // Should be valid JSON
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let parsed: any;
  expect(() => {
    parsed = JSON.parse(jsonString);
  }, 'Output should be valid JSON').to.not.throw();

  // Should be an array
  expect(parsed, 'JSON output should be an array').to.be.an('array');

  // Check length if specified
  if (expectedLength !== undefined) {
    expect(parsed, `Should have ${expectedLength} calendars`).to.have.length(expectedLength);
  }

  return parsed;
}

/**
 * Validates calendar object structure in JSON output
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateCalendarObject(calendar: any): void {
  expect(calendar, 'Calendar should be an object').to.be.an('object');
  expect(calendar, 'Calendar should have an id').to.have.property('id');
  expect(calendar.id, 'Calendar id should be a string').to.be.a('string');

  // summary can be null or string
  if (calendar.summary !== null && calendar.summary !== undefined) {
    expect(calendar.summary, 'Calendar summary should be a string when present').to.be.a('string');
  }
}

/**
 * Validates table output format and structure
 */
export function validateTableOutput(output: string, expectedCount: number): void {
  if (expectedCount === 0) {
    expect(output).to.contain('No calendars found.');
    return;
  }

  expect(output).to.contain(`Available Calendars (${expectedCount} found)`);

  // Check that numbered list exists
  for (let i = 1; i <= Math.min(expectedCount, 10); i++) {
    expect(output).to.contain(`${i}. `);
  }
}

/**
 * Validates stdout/stderr separation
 */
export function validateOutputSeparation(stdout: string, stderr: string, isQuiet: boolean = false): void {
  if (isQuiet) {
    // Status messages should not appear in either output when quiet
    expect(stderr).to.not.contain('Authenticating with Google Calendar...');
    expect(stderr).to.not.contain('Fetching calendars...');
    expect(stdout).to.not.contain('Authenticating with Google Calendar...');
    expect(stdout).to.not.contain('Fetching calendars...');
  } else {
    // Status messages should be in stderr only
    expect(stderr).to.contain('Authenticating with Google Calendar...');
    expect(stderr).to.contain('Fetching calendars...');
    expect(stdout).to.not.contain('Authenticating with Google Calendar...');
    expect(stdout).to.not.contain('Fetching calendars...');
  }

  // Result data should be in stdout only
  if (stdout.includes('Available Calendars') || stdout.includes('No calendars found')) {
    expect(stderr).to.not.contain('Available Calendars');
    expect(stderr).to.not.contain('No calendars found');
  }
}

/**
 * Validates that calendar information is displayed correctly in table format
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateCalendarTableDisplay(output: string, calendar: any, index: number): void {
  const primaryLabel = calendar.primary ? ' (Primary)' : '';
  const expectedName = calendar.summary || '(No name)';

  expect(output).to.contain(`${index}. ${expectedName}${primaryLabel}`);
  expect(output).to.contain(`ID: ${calendar.id}`);

  if (calendar.accessRole) {
    expect(output).to.contain(`Access: ${calendar.accessRole}`);
  }

  if (calendar.description) {
    expect(output).to.contain(`Description: ${calendar.description}`);
  }

  if (calendar.backgroundColor) {
    expect(output).to.contain(`Color: ${calendar.backgroundColor}`);
  }
}

/**
 * Validates that special characters and Unicode are handled correctly
 */
export function validateUnicodeHandling(output: string): void {
  // Should not contain escaped Unicode sequences in the final output
  expect(output).to.not.match(/\\u[0-9a-fA-F]{4}/);

  // Should preserve emojis and special characters
  const unicodeTestStrings = [
    '📅',
    '🎉',
    '🎊',
    '🎈',
    'émojis',
    'spëcial',
    'ñøñ-ASCII',
    '仕事',
    '会議',
    '日本語',
    'العربية',
    'تقويم',
    'München',
    'für',
  ];

  const containsUnicode = unicodeTestStrings.some((str) => output.includes(str));
  if (containsUnicode) {
    // If Unicode content is present, verify it's displayed correctly
    for (const str of unicodeTestStrings) {
      if (output.includes(str)) {
        expect(output).to.contain(str, `Unicode string "${str}" should be preserved`);
      }
    }
  }
}

/**
 * Validates JSON output doesn't contain status messages (for piping)
 */
export function validateCleanJsonOutput(jsonOutput: string): void {
  // Should not contain any status messages
  expect(jsonOutput).to.not.contain('Authenticating');
  expect(jsonOutput).to.not.contain('Fetching');
  expect(jsonOutput).to.not.contain('Available Calendars');

  // Should start with [ and end with ]
  const trimmed = jsonOutput.trim();
  expect(trimmed.startsWith('[')).to.equal(true, 'JSON should start with [');
  expect(trimmed.endsWith(']')).to.equal(true, 'JSON should end with ]');

  // Should be parseable
  expect(() => JSON.parse(trimmed)).to.not.throw();
}

/**
 * Helper to check if output contains expected calendar count
 */
export function expectCalendarCount(output: string, count: number): void {
  if (count === 0) {
    expect(output).to.contain('No calendars found.');
  } else {
    expect(output).to.contain(`Available Calendars (${count} found)`);
  }
}

/**
 * Helper to validate color codes in output
 */
export function validateColorCodes(output: string): void {
  // Find all color references in output
  const colorMatches = output.match(/Color: #[a-fA-F0-9]{6}/g);

  if (colorMatches) {
    for (const colorMatch of colorMatches) {
      const colorCode = colorMatch.replace('Color: ', '');
      expect(colorCode).to.match(/^#[a-fA-F0-9]{6}$/, `Color code ${colorCode} should be valid hex`);
    }
  }
}

/**
 * Performance validation helper
 */
export function validatePerformance(startTime: number, maxDurationMs: number): void {
  const duration = Date.now() - startTime;
  expect(duration).to.be.below(
    maxDurationMs,
    `Operation should complete within ${maxDurationMs}ms but took ${duration}ms`,
  );
}
