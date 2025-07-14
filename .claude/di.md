# gcal-commander DI System

## Test Setup Pattern

### Current Approach: TestContainerFactory

See `test/commands/config.test.ts` for standard integration test setup patterns.

### Legacy Pattern (Removed)

The deprecated setupTestContainer/cleanupTestContainer functions have been removed. Use TestContainerFactory.create() instead.

## Available Mock Services

TestContainerFactory provides Vitest-mocked mock services:

- **mockCalendarService**: Mocked ICalendarService with methods like `listEvents.mockResolvedValue()`, `createEvent.mockResolvedValue()`
- **mockAuthService**: Mocked IAuthService with methods like `getCalendarAuth.mockResolvedValue()`
- **mockConfigService**: Real ConfigService instance with mocked storage (not mocked)
- **mockConfigStorage**: Mocked IConfigStorage with methods like `read.mockResolvedValue()`, `write.mockResolvedValue()`, `exists.mockResolvedValue()`
- **mockPromptService**: Mocked IPromptService with methods like `confirm.mockResolvedValue()`

### Factory Methods

- **`TestContainerFactory.create(options?)`**: Create container with custom mock configurations
- **`TestContainerFactory.createSuccessful(options?)`**: Create container with successful default behaviors
- **`TestContainerFactory.cleanup()`**: Clean up test container (use in afterEach)

## ConfigService & ConfigStorage Architecture

### Production Setup
- **ConfigService**: DI singleton that manages user configuration (settings, defaults)
- **ConfigStorage**: Abstraction layer for file system operations
- **FileSystemConfigStorage**: Production implementation using real file system

### Key Files
- `src/services/config.ts`: Main ConfigService implementation with DI
- `src/services/config-storage.ts`: FileSystemConfigStorage for production
- `src/interfaces/config-storage.ts`: IConfigStorage abstraction interface
- `src/interfaces/services.ts`: IConfigService interface + Config type
- `test/test-utils/mock-factories/config-storage-mock-factory.ts`: Mock factory for tests

### Usage Examples
- **DI Registration**: See `src/di/container.ts` for ConfigService and ConfigStorage setup
- **Command Usage**: See `src/commands/config.ts` or `src/commands/events/list.ts` for this.configService usage
- **Testing Patterns**: See `test/commands/config.test.ts` for mock storage configuration

## Common Issues

- **Mock behavior not applied**: Configure mocks after `TestContainerFactory.create()`
- **Test interference**: Always use `TestContainerFactory.cleanup()` in `afterEach()`
- **Mocking errors**: Use Vitest syntax: `mockService.method.mockResolvedValue(value)` or `mockService.method.mockRejectedValue(error)`
- **ConfigService vs ConfigStorage**: ConfigService handles business logic, ConfigStorage handles file I/O
- **Migration**: All tests have been migrated from deprecated setupTestContainer to TestContainerFactory