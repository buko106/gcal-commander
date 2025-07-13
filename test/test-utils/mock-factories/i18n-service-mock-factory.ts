import type { MockedObject } from 'vitest';

import { vi } from 'vitest';

import { II18nService } from '../../../src/interfaces/services';

export const I18nServiceMockFactory = {
  create(): MockedObject<II18nService> {
    const mockI18nService = {
      changeLanguage: vi.fn(),
      init: vi.fn(),
      t: vi.fn(),
    } as MockedObject<II18nService>;

    // Default behaviors for testing
    mockI18nService.init.mockResolvedValue();
    mockI18nService.t.mockImplementation((key: string) => key); // Return the key as-is by default
    mockI18nService.changeLanguage.mockResolvedValue();

    return mockI18nService;
  },
};
