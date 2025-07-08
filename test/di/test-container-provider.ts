import { DependencyContainer } from 'tsyringe';

import { IContainerProvider } from '../../src/di/container-provider';
import { getTestContainer } from './test-container';

/**
 * Test container provider
 * Uses the test container with mocks
 */
export class TestContainerProvider implements IContainerProvider {
  getContainer(): DependencyContainer {
    return getTestContainer();
  }
}
