# TDD Workflow - Quick Reference

## Core Micro-Cycle (Red-Green-Refactor)

### 1. Plan Tasks
```bash
# Break feature into small, testable units
# Use TodoWrite tool to track progress
```

### 2. RED: Write ONE Failing Test
```bash
# ✅ Start Small: Test one tiny piece of functionality
# ✅ Add only a single test case at a time
npm run test:file test/path/to/test.test.ts
# ✅ Fail First: Ensure test actually fails before implementing
```

### 3. GREEN: Implement Minimal Code
```bash
# ✅ Minimal Code: Write just enough to pass the test
npm run test:file test/path/to/test.test.ts
# ✅ Test should now pass
```

### 4. REFACTOR: Improve Code (Optional)
```bash
# ✅ Refactor Safely: Only when tests are green
# ✅ Improve code while keeping tests green
npm run test:file test/path/to/test.test.ts
# ✅ All tests still pass
npm test
# ✅ No regressions in full suite
```

### 5. Repeat Micro-Cycle
```bash
# ✅ Incremental: Build functionality step by step
# ✅ Test Continuously: Run tests after each change
# Return to step 2 for next small functionality
```

## Quick Test Commands

### Run Specific Tests
```bash
# Single test file
npm run test:file test/commands/events/list.test.ts

# Multiple related files
npm run test:file "test/commands/events/*.test.ts"

# Full test suite
npm test
```


## CLI Testing Checklist

### Required Test Scenarios
- [ ] Basic functionality with default data
- [ ] stdout/stderr separation
- [ ] JSON output is clean and parseable
- [ ] --quiet flag suppresses stderr
- [ ] Error handling (authentication, validation)
- [ ] Flag parsing and validation

### Essential Test Pattern

**IMPORTANT: Use V2 Mock System for new tests**
For all new test cases, use the v2 mock system documented in `@MIGRATION_GUIDE_V2_MOCKS.md`. The old pattern below is for reference only.

#### V2 Pattern (Recommended for new tests)
```typescript
import { createMockCalendarService } from '../../src/test-utils/mock-factories';
import { TestContainerBuilder } from '../../src/test-utils/test-container-builder';
import { testScenarios } from '../../src/test-utils/test-helpers';

describe('command name (v2)', () => {
  let cleanup: () => void;

  afterEach(() => {
    if (cleanup) {
      cleanup();
    }
  });

  it('should separate status from data output', async () => {
    const context = new TestContainerBuilder()
      .withMockCalendarService(createMockCalendarService({
        events: [{ id: 'test', summary: 'Test Event' }]
      }))
      .withDefaultMocks()
      .activate();
    
    cleanup = () => context.cleanup();

    const {stderr, stdout} = await runCommand('command --format json');
    expect(stderr).to.contain('Status message');
    expect(stdout).to.not.contain('Status message');
    expect(() => JSON.parse(stdout)).to.not.throw();
  });

  it('should handle predefined scenarios', async () => {
    const context = testScenarios.unicodeState();
    cleanup = () => context.cleanup();

    const {stdout} = await runCommand('command');
    expect(stdout).to.contain('Expected output');
  });
});
```

#### Legacy Pattern (for reference)
```typescript
describe('command name', () => {
  beforeEach(() => {
    const mocks = setupTestContainer();
    mockService = mocks.mockServiceName;
  });

  afterEach(() => {
    cleanupTestContainer();
  });

  it('should separate status from data output', async () => {
    const {stderr, stdout} = await runCommand('command --format json');
    expect(stderr).to.contain('Status message');
    expect(stdout).to.not.contain('Status message');
    expect(() => JSON.parse(stdout)).to.not.throw();
  });
});
```

## Quality Gates

### Before Committing
```bash
# Run all tests
npm test

# Check linting
npm run lint

# Verify build
npm run build
```

### Integration Test Setup

**IMPORTANT: Use V2 Mock System for new integration tests**

#### V2 Integration Test Pattern (Recommended)
```typescript
import { createMockCalendarService } from '../../src/test-utils/mock-factories';
import { TestContainerBuilder } from '../../src/test-utils/test-container-builder';
import { testScenarios } from '../../src/test-utils/test-helpers';

// Using TestContainerBuilder for explicit configuration
beforeEach(() => {
  const context = new TestContainerBuilder()
    .withMockCalendarService(createMockCalendarService({
      events: [...testEvents]
    }))
    .withDefaultMocks()
    .activate();
  
  cleanup = () => context.cleanup();
});

afterEach(() => {
  if (cleanup) {
    cleanup();
  }
});

// Or using predefined scenarios
beforeEach(() => {
  const context = testScenarios.largeDatasetState(15);
  cleanup = () => context.cleanup();
});
```

#### Legacy Integration Test Pattern (for reference)
```typescript
// Standard pattern for integration tests
beforeEach(() => {
  const mocks = setupTestContainer();
  mockCalendarService = mocks.mockCalendarService;
  // Set up test data
  mockCalendarService.setMockEvents([...testEvents]);
});

afterEach(() => {
  cleanupTestContainer();
});
```

## Common Test Data Patterns

**IMPORTANT: Use V2 Mock System test data generators**

### V2 Mock Service Data (Recommended)
```typescript
import { TEST_EVENTS, generateTestEvents } from '../../src/test-utils/test-data-defaults';
import { TestDataGenerators } from '../../src/test-utils/test-helpers';

// Use predefined test events
const detailedEvent = TEST_EVENTS.DETAILED_EVENT;
const unicodeEvent = TEST_EVENTS.UNICODE_EVENT;
const allDayEvent = TEST_EVENTS.ALL_DAY_EVENT;

// Use test data generators
const eventsWithAttendees = TestDataGenerators.eventsWithAttendees(3);
const complexEvents = TestDataGenerators.complexEvents();

// Generate multiple events
const manyEvents = generateTestEvents(15);

// Create custom mock service
const mockService = createMockCalendarService({
  events: [TEST_EVENTS.DETAILED_EVENT, ...generateTestEvents(5)]
});
```

### Legacy Mock Service Data (for reference)
```typescript
// Comprehensive test event
const testEvent = {
  id: 'test-event-1',
  summary: 'Test Event with "quotes" & symbols',
  description: 'Multi-line\ndescription',
  location: 'Test Location 🏢',
  start: { dateTime: '2024-06-25T10:00:00Z' },
  end: { dateTime: '2024-06-25T11:00:00Z' },
  attendees: [
    { email: 'test@example.com', responseStatus: 'accepted' }
  ]
};
```

### Edge Cases to Test
- Empty datasets
- Unicode characters and emojis
- Special characters in strings
- Null/undefined properties
- Large datasets
- Network failures (mocked)


## Anti-Patterns to Avoid

- Writing multiple features before testing
- Testing implementation details instead of behavior
- Skipping the failing test step
- Large, complex tests that are hard to debug
- Not running full test suite before committing
- Mixing production and test code in same commit