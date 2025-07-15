import { MockedObject, vi } from 'vitest';

import { IConfigStorage } from '../../../src/interfaces/config-storage';

export interface ConfigStorageMockOptions {
  exists?: boolean;
  initialContent?: string;
  readError?: Error;
  writeError?: Error;
}

export const ConfigStorageMockFactory = {
  create(options: ConfigStorageMockOptions = {}): IConfigStorage & MockedObject<IConfigStorage> {
    const mock = {
      exists: vi.fn(),
      getConfigPath: vi.fn(),
      read: vi.fn(),
      write: vi.fn(),
    } as MockedObject<IConfigStorage>;

    // Set up default behaviors
    const exists = options.exists ?? false;
    const initialContent = options.initialContent || '{}';

    mock.exists.mockResolvedValue(exists);
    mock.getConfigPath.mockReturnValue('in-memory');

    if (exists) {
      mock.read.mockResolvedValue(initialContent);
    } else {
      mock.read.mockRejectedValue(new Error('ENOENT: no such file or directory'));
    }

    // Set up default write behavior
    mock.write.mockResolvedValue();

    // Handle error scenarios
    if (options.readError) {
      mock.read.mockRejectedValue(options.readError);
    }

    if (options.writeError) {
      mock.write.mockRejectedValue(options.writeError);
    }

    return mock;
  },
};
