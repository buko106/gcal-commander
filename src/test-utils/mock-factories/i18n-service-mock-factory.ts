import * as sinon from 'sinon';
import { II18nService } from '../../interfaces/services';

export class I18nServiceMockFactory {
  static create(): II18nService & sinon.SinonStubbedInstance<II18nService> {
    const mockI18nService = {
      init: sinon.stub(),
      t: sinon.stub(),
      changeLanguage: sinon.stub(),
      getAvailableLanguages: sinon.stub()
    };

    // Default behaviors for testing
    mockI18nService.init.resolves();
    mockI18nService.t.returnsArg(0); // Return the key as-is by default
    mockI18nService.changeLanguage.resolves();
    mockI18nService.getAvailableLanguages.returns(['en', 'ja']);

    return mockI18nService;
  }
}