# gcal-commander DI System

## Test Setup Pattern

### Current Approach: TestContainerFactory

```typescript
// Standard setup for integration tests
import { TestContainerFactory } from '../src/test-utils/mock-factories/test-container-factory';

describe('command integration test', () => {
  let mockCalendarService: ICalendarService & sinon.SinonStubbedInstance<ICalendarService>;

  beforeEach(() => {
    const { mocks } = TestContainerFactory.create();
    mockCalendarService = mocks.calendarService;
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  it('should work with custom test data', async () => {
    // Configure mock behavior for test
    mockCalendarService.listEvents.resolves([
      { id: '1', summary: 'Test Event 📅' }
    ]);

    const { stdout } = await runCommand('events list');
    expect(stdout).to.contain('Test Event 📅');
  });
});
```

### Legacy Pattern (Deprecated)

```typescript
// ⚠️ DEPRECATED: Use TestContainerFactory.create() instead
import { setupTestContainer, cleanupTestContainer } from '../src/di/test-container';
```

## Available Mock Services

TestContainerFactory provides Sinon-stubbed mock services:

- **mockCalendarService**: Stubbed ICalendarService with methods like `listEvents.resolves()`, `createEvent.resolves()`
- **mockAuthService**: Stubbed IAuthService with methods like `getCalendarAuth.resolves()`
- **mockPromptService**: Stubbed IPromptService with methods like `confirm.resolves()`

### Factory Methods

- **`TestContainerFactory.create(options?)`**: Create container with custom mock configurations
- **`TestContainerFactory.createSuccessful(options?)`**: Create container with successful default behaviors
- **`TestContainerFactory.cleanup()`**: Clean up test container (use in afterEach)

## Common Issues

- **Mock behavior not applied**: Configure stubs after `TestContainerFactory.create()`
- **Test interference**: Always use `TestContainerFactory.cleanup()` in `afterEach()`
- **Stubbing errors**: Use Sinon syntax: `mockService.method.resolves(value)` or `mockService.method.rejects(error)`