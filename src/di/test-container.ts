import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';

let testContainer: DependencyContainer | null = null;

/**
 * Set the test container instance (for use by TestContainerFactory)
 * @internal
 */
export function setTestContainer(container: DependencyContainer): void {
  testContainer = container;
}

/**
 * Get test container instance
 * For use in tests that need to resolve services
 */
export function getTestContainer(): DependencyContainer {
  if (!testContainer) {
    throw new Error('Test container not initialized. Call TestContainerFactory.create() first.');
  }

  return testContainer;
}
