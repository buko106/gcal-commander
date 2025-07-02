import * as sinon from 'sinon';

import { IPromptService } from '../../interfaces/services';

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
  static create(options: PromptServiceMockOptions = {}): IPromptService & sinon.SinonStubbedInstance<IPromptService> {
    const mock = {
      confirm: sinon.stub(),
      select: sinon.stub(),
    } as IPromptService & sinon.SinonStubbedInstance<IPromptService>;

    // Configure confirm behavior
    if (options.errors?.confirm) {
      mock.confirm.rejects(options.errors.confirm);
    } else {
      mock.confirm.resolves(options.confirmResponse ?? true);
    }

    // Configure select behavior
    if (options.errors?.select) {
      mock.select.rejects(options.errors.select);
    } else {
      mock.select.resolves(options.selectResponse ?? 'en');
    }

    return mock;
  }

  /**
   * Create a PromptService mock that always confirms (returns true)
   */
  static createConfirming(): IPromptService & sinon.SinonStubbedInstance<IPromptService> {
    return this.create({ confirmResponse: true });
  }

  /**
   * Create a PromptService mock that always declines (returns false)
   */
  static createDeclining(): IPromptService & sinon.SinonStubbedInstance<IPromptService> {
    return this.create({ confirmResponse: false });
  }

  /**
   * Create a PromptService mock that throws an error
   */
  static createWithError(error: Error): IPromptService & sinon.SinonStubbedInstance<IPromptService> {
    return this.create({ errors: { confirm: error } });
  }
}