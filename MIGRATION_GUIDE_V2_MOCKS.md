# Test Mock System v2 Migration Guide

## Overview

A new pattern has been introduced to solve the issues with the existing DI and Mock implementation:

- **Mock Factory Pattern**: Type-safe and lightweight mock data generation
- **Test Container Builder**: Explicit and transparent test configuration
- **Gradual Migration**: Migrate to new patterns without breaking existing tests

## New Pattern Features

### ✅ Resolved Issues

1. **Transparency**: Test configuration is clearly readable from test code
2. **Extensibility**: Flexible adaptation to new test cases
3. **Isolation**: Prevention of interference between tests
4. **Type Safety**: Maximum utilization of TypeScript type checking

### 🆕 New File Structure

```
src/test-utils/
├── mock-factories.ts      # Mock Factory functions
├── test-container-builder.ts  # Test Container Builder
├── test-data-defaults.ts  # Default test data
├── test-helpers.ts        # Convenient helper functions
└── mock-services.ts      # Existing mock services (backward compatibility)
```

## Migration Method

### Old Pattern (Current)

```typescript
// Old pattern - hidden setupTestContainer
import { setupTestContainer, cleanupTestContainer } from '../../../src/di/test-container';
import { MockCalendarService } from '../../../src/test-utils/mock-services';

describe('command test', () => {
  let mockCalendarService: MockCalendarService;

  beforeEach(() => {
    const mocks = setupTestContainer();
    mockCalendarService = mocks.mockCalendarService;
  });

  afterEach(() => {
    cleanupTestContainer();
  });

  it('should work with custom data', async () => {
    // Change mock data at runtime
    mockCalendarService.setMockEvents([
      { id: '1', summary: 'Test Event' }
    ]);

    const { stdout } = await runCommand('events list');
    expect(stdout).to.contain('Test Event');
  });
});
```

### New Pattern (Recommended)

```typescript
// New pattern - explicit and type-safe
import { createMockCalendarService } from '../../../src/test-utils/mock-factories';
import { TestContainerBuilder } from '../../../src/test-utils/test-container-builder';
import { testScenarios } from '../../../src/test-utils/test-helpers';

describe('command test (v2)', () => {
  let cleanup: () => void;

  afterEach(() => {
    if (cleanup) {
      cleanup();
    }
  });

  it('should work with custom data', async () => {
    // Explicitly specify mock data at configuration time
    const context = new TestContainerBuilder()
      .withMockCalendarService(createMockCalendarService({
        events: [{ id: '1', summary: 'Test Event' }]
      }))
      .withDefaultMocks()
      .activate();
    
    cleanup = () => context.cleanup();

    const { stdout } = await runCommand('events list');
    expect(stdout).to.contain('Test Event');
  });

  it('should handle predefined scenarios', async () => {
    // Use predefined test scenarios
    const context = testScenarios.unicodeState();
    cleanup = () => context.cleanup();

    const { stdout } = await runCommand('events list');
    expect(stdout).to.contain('会議 📅');
  });
});
```

## Main Features of New Pattern

### 1. Mock Factory Functions

```typescript
// Basic usage
const mockService = createMockCalendarService();

// Partial data override
const mockService = createMockCalendarService({
  events: [{ id: 'custom', summary: 'Custom Event' }]
});

// For error testing
const errorService = createErrorMockCalendarService('auth');
```

### 2. Test Container Builder

```typescript
// Simple test configuration
const context = createTestContainer();

// Custom service configuration
const context = new TestContainerBuilder()
  .withMockCalendarService(customMockService)
  .withMockAuthService(customAuthService)
  .activate();

// Configuration transparency
const context = createTestContainerWithCalendarService(
  createMockCalendarService({ events: customEvents })
);
```

### 3. Predefined Test Scenarios

```typescript
// Empty state
testScenarios.emptyState()

// Large dataset
testScenarios.largeDatasetState(50)

// Unicode character testing
testScenarios.unicodeState()

// Error scenarios
testScenarios.authErrorState()
```

## Migration Strategy

### Phase 1: Use new pattern for new test files
- Use v2 pattern for newly created tests
- Keep existing tests as they are

### Phase 2: Gradual migration of existing tests
- Migrate important test files sequentially
- Create `.v2` files during migration for parallel execution

### Phase 3: Deprecation of old pattern
- Deprecate old pattern after all tests are migrated
- Finally remove `setupTestContainer`

## Best Practices

### 1. Prioritize explicit configuration
```typescript
// ✅ Good: Configuration is clear
const context = new TestContainerBuilder()
  .withMockCalendarService(createMockCalendarService({
    events: specificTestEvents
  }))
  .activate();

// ❌ Avoid: Hidden configuration
const mocks = setupTestContainer();
mockService.setMockEvents(specificTestEvents);
```

### 2. Utilize predefined scenarios
```typescript
// ✅ Good: Reusable scenarios
const context = testScenarios.unicodeState();

// ❌ Avoid: Custom data per test
const customEvents = [/* long test data */];
```

### 3. Proper cleanup
```typescript
// ✅ Good: Reliable cleanup
afterEach(() => {
  if (cleanup) {
    cleanup();
  }
});

// ❌ Avoid: Forgotten cleanup
// afterEach(() => {}); // Empty cleanup
```

## Compatibility with Existing Code

The v2 pattern does not break existing tests:

- ✅ All 153 existing tests continue to work
- ✅ Existing `setupTestContainer`/`cleanupTestContainer` remain available
- ✅ Gradual migration minimizes impact scope

## Support

### Detailed Information
- `src/test-utils/test-helpers.ts`: Convenient helper functions
- `test/commands/events/list.v2.integration.test.ts`: New pattern implementation example

### Migration Support
If you have questions about migrating to the new pattern:
1. Refer to existing new pattern test examples
2. Check predefined patterns in `testScenarios`
3. Check type definitions in `Mock Factory` functions