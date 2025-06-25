# Test-Driven Development (TDD) Practices

## Core TDD Workflow

### Red-Green-Refactor Cycle

1. **Manage tasks with simple todo lists**
   - Break features into small, manageable tasks
   - Implement tasks in priority order

**Core Micro-Cycle (Repeat 2-5 for each small functionality):**

2. **Pick high-priority items from todo list and write tests**
   - Start with simple, isolated functionality first
   - Write failing tests before implementation

3. **Make tests fail (RED phase)**
   - Create tests that define expected behavior
   - Ensure tests actually fail before implementation

4. **Implement minimal code to pass tests**
   - Write only the minimum code needed to pass tests
   - Keep implementation simple, avoid over-engineering

5. **Make tests pass (GREEN phase)**
   - Verify all tests pass
   - Ensure new functionality doesn't break existing features

**Repeat steps 2-5 to build up functionality incrementally**
- Each cycle adds one small piece of working functionality
- Accumulate these micro-cycles to build feature chunks
- After several micro-cycles, when you have a meaningful feature chunk:

6. **Refactor while keeping tests green (REFACTORING phase)**
   - Improve code quality while maintaining test coverage
   - Remove duplication, improve readability, enhance design
   - Consolidate patterns that emerged during implementation
   - Return to step 2 to continue with next functionality

## Implementation Approach

### 1. Incremental Development
- Break complex changes into smallest possible units
- Implement one change at a time with immediate testing
- Each step should be independently testable and verifiable

### 2. Test-First Approach
- Write tests before implementing functionality when possible
- Create failing tests that define expected behavior
- Implement code to make tests pass, then refactor

### 3. Step-by-Step Testing Process
```bash
# Example workflow for new features
1. Write utility/service tests first
   npm test -- --grep "UtilityName"
   
2. Implement utility/service functionality
   npm test -- --grep "UtilityName"
   
3. Write command tests
   npm test -- --grep "CommandName"
   
4. Implement command functionality
   npm test -- --grep "CommandName"
   
5. Run full test suite
   npm test
   
6. Fix any integration issues
   npm test
```

## Testing Granularity and Scope

### Test Levels
- **Unit Tests**: Test individual functions and classes in isolation
- **Integration Tests**: Test command behavior end-to-end using `@oclif/test`
- **Output Separation Tests**: Verify stdout/stderr separation for JSON vs table formats
- **Error Handling Tests**: Test authentication failures and edge cases

### Continuous Verification
- Run tests after each small change
- Verify both new and existing functionality
- Run linting to catch style issues early: `npm run lint`
- Use `npm run build` to catch TypeScript compilation errors

## CLI-Specific Testing Patterns

### Test Organization
- Mirror `src/` structure in `test/` directory
- Group related tests using `describe()` blocks
- Use descriptive test names that explain expected behavior
- Test both success and failure scenarios

### CLI Testing Requirements
- Use `@oclif/test`'s `runCommand()` for end-to-end command testing
- Test stdout/stderr separation: `const {stdout, stderr} = await runCommand(...)`
- Test command flag parsing and validation
- Test authentication flow behavior (success/failure cases)
- Verify JSON output is clean and parseable (no status messages mixed in)

### Essential CLI Test Patterns
```typescript
// Test stdout/stderr separation
it('separates status from data output', async () => {
  const {stderr, stdout} = await runCommand('events list --format json');
  expect(stderr).to.contain('Authenticating with Google Calendar...');
  expect(stdout).to.not.contain('Authenticating');
  expect(() => JSON.parse(stdout)).to.not.throw(); // Clean JSON
});

// Test pipeable output
it('produces clean JSON for piping', async () => {
  const {stdout} = await runCommand('events list --format json');
  const events = JSON.parse(stdout); // Should not throw
  expect(Array.isArray(events)).to.be.true;
});
```

## Refactoring Safety

### Safe Refactoring Practices
- Keep existing tests passing during refactoring
- Add new tests for new functionality before changing implementation
- Run full test suite before and after major changes
- Use TypeScript compilation as an additional safety net

### Quality Assurance
This approach ensures robust, maintainable code and prevents regressions while making it easy to identify and fix issues quickly.

## TSyringe Dependency Injection System

### Overview
The project uses TSyringe for type-safe dependency injection with proper separation between production and test environments through container isolation.

### TSyringe Architecture
```typescript
// Type-safe service resolution
container.resolve<ICalendarService>(TOKENS.CalendarService);

// Production uses registered services via @injectable decorators
// Test mode uses child containers with mock service registrations
```

### Key Components

#### 1. Container Setup (`src/di/container.ts`)
- **Service Registration**: Uses `@injectable` decorators and token-based registration
- **Type Safety**: Full TypeScript support with interface-based service tokens
- **Production Container**: Registers real services using `useClass` patterns
- **Methods**:
  - `setupContainer()`: Initializes production service registrations
  - `container.resolve<T>(token)`: Type-safe service resolution

#### 2. Test Container (`src/di/test-container.ts`)
- **Container Isolation**: Creates child containers for test environments
- **Mock Registration**: Registers mock services with `useValue` pattern
- **Test Safety**: Proper cleanup prevents test interference
- **Methods**:
  - `setupTestContainer()`: Creates isolated test container with mocks
  - `cleanupTestContainer()`: Cleans up test container instances
  - `getTestContainer()`: Gets current test container instance

#### 3. Mock Services (`src/test-utils/mock-services.ts`)
- **MockAuthService**: Provides fake authentication without API calls
- **MockCalendarService**: Simulates Google Calendar API with controllable data
- **Interface Compliance**: Implement same interfaces as real services
- **Test Data Control**: Helper methods to manipulate mock data

### Mock Service Setup Pattern

#### Standard Integration Test Setup
```typescript
describe('command integration', () => {
  let mockCalendarService: MockCalendarService;

  beforeEach(() => {
    const mocks = setupTestContainer();
    mockCalendarService = mocks.mockCalendarService;
  });

  afterEach(() => {
    cleanupTestContainer();
  });

  // Tests using mockCalendarService helper methods
  it('should handle custom test data', async () => {
    mockCalendarService.setMockEvents([...customEvents]);
    const { stdout } = await runCommand('events list');
    // Assertions...
  });
});
```

### Mock Service Capabilities

#### MockCalendarService Features
- **Default Data**: Pre-populated with sample events and calendars
- **Data Manipulation**: 
  - `setMockEvents(events)`: Replace event data
  - `setMockCalendars(calendars)`: Replace calendar data
- **API Simulation**: Implements all ICalendarService methods
- **Event Creation**: `createEvent()` generates mock events with unique IDs

#### MockAuthService Features
- **Fake Credentials**: Provides mock access/refresh tokens
- **No API Calls**: Simulates successful authentication without network requests
- **Consistent Interface**: Implements IAuthService interface

### Test File Organization

#### Test Categories
1. **Unit Tests** (`*.test.ts`): Basic flag parsing and validation
2. **Integration Tests** (`*.integration.test.ts`): End-to-end with mocks
3. **Output Tests** (`*.output.test.ts`): Focus on formatting and display

#### Integration Test Patterns
```typescript
// Test data setup
beforeEach(() => {
  const testEvents = [
    { id: 'test-1', summary: 'Test Event', /* ... */ },
    { id: 'test-2', summary: 'Another Event', /* ... */ }
  ];
  mockCalendarService.setMockEvents(testEvents);
});

// Test scenarios to cover:
// - Basic functionality with default data
// - Custom data scenarios (empty lists, large datasets, Unicode)
// - Output format consistency (table vs JSON)
// - Error handling and edge cases
// - Flag combinations and validation
```

### Common Integration Test Scenarios

#### 1. stdout/stderr Separation
```typescript
it('should separate status messages from data output', async () => {
  const { stderr, stdout } = await runCommand('events list');
  
  expect(stderr).to.contain('Authenticating with Google Calendar...');
  expect(stdout).to.contain('Upcoming Events');
  expect(stdout).to.not.contain('Authenticating');
});
```

#### 2. JSON Output Validation
```typescript
it('should produce clean JSON output', async () => {
  const { stdout } = await runCommand('events list --format json');
  
  expect(() => JSON.parse(stdout)).to.not.throw();
  const events = JSON.parse(stdout);
  expect(Array.isArray(events)).to.be.true;
});
```

#### 3. Mock Data Scenarios
```typescript
it('should handle Unicode and special characters', async () => {
  const unicodeEvents = [
    { summary: '会議 📅', location: '東京オフィス 🏢' }
  ];
  mockCalendarService.setMockEvents(unicodeEvents);
  
  const { stdout } = await runCommand('events list');
  expect(stdout).to.contain('会議 📅');
});
```

#### 4. Quiet Flag Behavior
```typescript
it('should suppress status messages with --quiet', async () => {
  const { stderr, stdout } = await runCommand('events list --quiet');
  
  expect(stderr).to.not.contain('Authenticating');
  expect(stdout).to.contain('Upcoming Events');
});
```

### Test Data Best Practices

#### Realistic Test Data
- Use diverse datasets to test edge cases
- Include Unicode characters, emojis, and special formatting
- Test with both empty and large datasets
- Include null/undefined property handling

#### Mock Data Patterns
```typescript
// Comprehensive event for testing all fields
const complexEvent = {
  id: 'complex-event',
  summary: 'Complex Event with "quotes" & symbols',
  description: 'Description with\nnewlines and\ttabs',
  location: 'Room with "special" chars & symbols',
  start: { dateTime: '2024-06-25T10:00:00Z' },
  end: { dateTime: '2024-06-25T11:00:00Z' },
  attendees: [
    { email: 'alice@example.com', responseStatus: 'accepted' },
    { email: 'bob@example.com', responseStatus: 'tentative' }
  ]
};
```

### Integration Testing Workflow

1. **Setup**: Create isolated test container with `setupTestContainer()` in `beforeEach()`
2. **Configure**: Set up test-specific data using mock helper methods
3. **Execute**: Run command with `runCommand()` (BaseCommand automatically uses test container)
4. **Verify**: Check both stdout/stderr separation and data accuracy
5. **Cleanup**: Clean up test container with `cleanupTestContainer()` in `afterEach()`

This TSyringe-based system enables comprehensive testing without external API dependencies while maintaining type safety and proper dependency injection patterns.
