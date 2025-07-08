import * as sinon from 'sinon';

import { AuthResult, IAuthService } from '../../../src/interfaces/services';

export interface AuthServiceMockOptions {
  authResult?: AuthResult;
  errors?: {
    getCalendarAuth?: Error;
  };
}

/**
 * Factory for creating AuthService mocks with configurable behaviors
 */
// eslint-disable-next-line unicorn/no-static-only-class
export class AuthServiceMockFactory {
  /**
   * Create an AuthService mock with specified options
   */
  static create(options: AuthServiceMockOptions = {}): IAuthService & sinon.SinonStubbedInstance<IAuthService> {
    const mock = {
      getCalendarAuth: sinon.stub(),
    } as IAuthService & sinon.SinonStubbedInstance<IAuthService>;

    // Configure getCalendarAuth behavior
    if (options.errors?.getCalendarAuth) {
      mock.getCalendarAuth.rejects(options.errors.getCalendarAuth);
    } else {
      const defaultAuthResult: AuthResult = {
        client: {
          credentials: {
            // eslint-disable-next-line camelcase
            access_token: 'mock-access-token',
            // eslint-disable-next-line camelcase
            refresh_token: 'mock-refresh-token',
          },
        },
      };
      mock.getCalendarAuth.resolves(options.authResult ?? defaultAuthResult);
    }

    return mock;
  }

  /**
   * Create an AuthService mock that always succeeds
   */
  static createSuccessful(): IAuthService & sinon.SinonStubbedInstance<IAuthService> {
    return this.create();
  }

  /**
   * Create an AuthService mock that throws an error
   */
  static createWithError(error: Error): IAuthService & sinon.SinonStubbedInstance<IAuthService> {
    return this.create({ errors: { getCalendarAuth: error } });
  }
}
