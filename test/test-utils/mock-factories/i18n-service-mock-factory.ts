import * as sinon from 'sinon';

import { II18nService } from '../../../src/interfaces/services';

export const I18nServiceMockFactory = {
  create(): II18nService & sinon.SinonStubbedInstance<II18nService> {
    const mockI18nService: II18nService & sinon.SinonStubbedInstance<II18nService> = {
      changeLanguage: sinon.stub<[string], Promise<void>>(),
      init: sinon.stub<[], Promise<void>>(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      t: sinon.stub<[string, any?], string>(),
    };

    // Default behaviors for testing
    mockI18nService.init.resolves();
    mockI18nService.t.returnsArg(0); // Return the key as-is by default
    mockI18nService.changeLanguage.resolves();

    return mockI18nService;
  },
};
