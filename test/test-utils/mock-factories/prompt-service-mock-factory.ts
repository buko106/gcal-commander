import { MockedObject, vi } from 'vitest';

import { IPromptService } from '../../../src/interfaces/services';

export interface PromptServiceMockOptions {
  confirmResponse?: boolean;
  errors?: {
    confirm?: Error;
    select?: Error;
  };
  selectResponse?: string;
}

/**
 * Factory for creating PromptService mocks with configurable behaviors
 */
// eslint-disable-next-line unicorn/no-static-only-class
export class PromptServiceMockFactory {
  /**
   * Create a PromptService mock with specified options
   */
  static create(options: PromptServiceMockOptions = {}): IPromptService & MockedObject<IPromptService> {
    const mock = {
      confirm: vi.fn(),
      select: vi.fn(),
    } as MockedObject<IPromptService>;

    // Configure confirm behavior
    if (options.errors?.confirm) {
      mock.confirm.mockRejectedValue(options.errors.confirm);
    } else {
      mock.confirm.mockResolvedValue(options.confirmResponse ?? true);
    }

    // Configure select behavior
    if (options.errors?.select) {
      mock.select.mockRejectedValue(options.errors.select);
    } else {
      mock.select.mockResolvedValue(options.selectResponse ?? 'en');
    }

    return mock;
  }

  /**
   * Create a PromptService mock that always confirms (returns true)
   */
  static createConfirming(): IPromptService & MockedObject<IPromptService> {
    return this.create({ confirmResponse: true });
  }

  /**
   * Create a PromptService mock that always declines (returns false)
   */
  static createDeclining(): IPromptService & MockedObject<IPromptService> {
    return this.create({ confirmResponse: false });
  }

  /**
   * Create a PromptService mock that throws an error
   */
  static createWithError(error: Error): IPromptService & MockedObject<IPromptService> {
    return this.create({ errors: { confirm: error } });
  }
}
