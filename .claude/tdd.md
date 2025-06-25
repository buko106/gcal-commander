# Test-Driven Development (TDD) Practices

## Core TDD Workflow

### Red-Green-Refactor Cycle

1. **Manage tasks with simple todo lists**
   - Break features into small, manageable tasks
   - Implement tasks in priority order

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

6. **Refactor while keeping tests green (REFACTORING phase)**
   - Improve code quality while maintaining test coverage
   - Remove duplication, improve readability, enhance design

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