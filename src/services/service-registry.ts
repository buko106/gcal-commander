/**
 * Service Registry for dependency injection
 * 
 * Provides a hybrid approach that works with oclif's lifecycle:
 * - Production: Uses default service implementations
 * - Test: Allows mock service injection via environment detection
 */
export class ServiceRegistry {
  private static readonly isTestMode = process.env.NODE_ENV === 'test';
  private static mockServices = new Map<string, unknown>();
  
  /**
   * Clear all registered mocks
   * Essential for test cleanup
   */
  static clearMocks(): void {
    this.mockServices.clear();
  }
  
  /**
   * Get service instance
   * Returns mock in test mode, default factory result otherwise
   */
  static get<T>(name: string, defaultFactory: () => T): T {
    const mock = this.isTestMode ? this.mockServices.get(name) : null;
    return (mock as T) || defaultFactory();
  }
  
  /**
   * Register a mock service for testing
   * Only works in test environment for safety
   */
  static registerMock<T>(name: string, service: T): void {
    if (this.isTestMode) {
      this.mockServices.set(name, service);
    }
  }
  
  /**
   * Check if running in test mode
   */
  static get testMode(): boolean {
    return this.isTestMode;
  }
}