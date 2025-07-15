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
```typescript
describe('command name', () => {
  beforeEach(() => {
    const mocks = TestContainerFactory.create();
    mockService = mocks.mockServiceName;
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  it('should separate status from data output', async () => {
    const {stderr, stdout} = await runCommand('command --format json');
    expect(stderr).toContain('Status message');
    expect(stdout).not.toContain('Status message');
    expect(() => JSON.parse(stdout)).not.toThrow();
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
```typescript
// Standard pattern for integration tests
beforeEach(() => {
  const mocks = TestContainerFactory.create();
  mockCalendarService = mocks.mockCalendarService;
  // Set up test data
  mockCalendarService.listEvents.mockResolvedValue(testEvents);
});

afterEach(() => {
  TestContainerFactory.cleanup();
});
```

## Common Test Data Patterns

### Mock Service Data
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