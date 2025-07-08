# gcal-commander DI System

## Test Setup Pattern

### Current Approach: TestContainerFactory

See `test/commands/config.test.ts` for standard integration test setup patterns.

### Legacy Pattern (Removed)

The deprecated setupTestContainer/cleanupTestContainer functions have been removed. Use TestContainerFactory.create() instead.

## Available Mock Services

TestContainerFactory provides Sinon-stubbed mock services:

- **mockCalendarService**: Stubbed ICalendarService with methods like `listEvents.resolves()`, `createEvent.resolves()`
- **mockAuthService**: Stubbed IAuthService with methods like `getCalendarAuth.resolves()`
- **mockConfigService**: Real ConfigService instance with mocked storage (not stubbed)
- **mockConfigStorage**: Stubbed IConfigStorage with methods like `read.resolves()`, `write.resolves()`, `exists.resolves()`
- **mockPromptService**: Stubbed IPromptService with methods like `confirm.resolves()`

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

- **Mock behavior not applied**: Configure stubs after `TestContainerFactory.create()`
- **Test interference**: Always use `TestContainerFactory.cleanup()` in `afterEach()`
- **Stubbing errors**: Use Sinon syntax: `mockService.method.resolves(value)` or `mockService.method.rejects(error)`
- **ConfigService vs ConfigStorage**: ConfigService handles business logic, ConfigStorage handles file I/O
- **Migration**: All tests have been migrated from deprecated setupTestContainer to TestContainerFactory