import { container, DependencyContainer } from 'tsyringe';

import { IContainerProvider } from './container-provider';

/**
 * Production container provider
 * Uses the main application container
 */
export class ProductionContainerProvider implements IContainerProvider {
  getContainer(): DependencyContainer {
    return container;
  }
}