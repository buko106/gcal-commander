# gcal-commander DI System

## Test Setup Pattern

```typescript
// Standard setup for integration tests
import { setupTestContainer, cleanupTestContainer } from '../src/di/test-container';

describe('command integration test', () => {
  let mockCalendarService: MockCalendarService;

  beforeEach(() => {
    const mocks = setupTestContainer();
    mockCalendarService = mocks.mockCalendarService;
  });

  afterEach(() => {
    cleanupTestContainer();
  });

  it('should work with custom test data', async () => {
    // Set up test-specific data
    mockCalendarService.setMockEvents([
      { id: '1', summary: 'Test Event 📅' }
    ]);

    const { stdout } = await runCommand('events list');
    expect(stdout).to.contain('Test Event 📅');
  });
});
```

## Available Mock Services

- **MockCalendarService**: `setMockEvents()`, `setMockCalendars()`
- **MockAuthService**: Fake authentication (no setup required)

## Common Issues

- **Mock data not applied**: Set data after `setupTestContainer()`
- **Test interference**: Always use `cleanupTestContainer()` in `afterEach()`