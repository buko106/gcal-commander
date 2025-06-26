import { DependencyContainer } from 'tsyringe';

/**
 * Interface for providing dependency container
 * Allows separation of test and production container logic
 */
export interface IContainerProvider {
  getContainer(): DependencyContainer;
}

let containerProvider: IContainerProvider | null = null;

/**
 * Set the container provider
 * This should be called during application initialization
 */
export function setContainerProvider(provider: IContainerProvider): void {
  containerProvider = provider;
}

/**
 * Get the current container provider
 * Throws error if not initialized
 */
export function getContainerProvider(): IContainerProvider {
  if (!containerProvider) {
    throw new Error('Container provider not initialized. Call setContainerProvider() first.');
  }

  return containerProvider;
}