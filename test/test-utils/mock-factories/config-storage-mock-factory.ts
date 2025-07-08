import * as sinon from 'sinon';

import { IConfigStorage } from '../../../src/interfaces/config-storage';

export interface ConfigStorageMockOptions {
  exists?: boolean;
  initialContent?: string;
  readError?: Error;
  writeError?: Error;
}

export const ConfigStorageMockFactory = {
  create(options: ConfigStorageMockOptions = {}): IConfigStorage & sinon.SinonStubbedInstance<IConfigStorage> {
    const mock = sinon.createStubInstance<IConfigStorage>(
      class implements IConfigStorage {
        async exists(): Promise<boolean> {
          return false;
        }

        getConfigPath(): string {
          return '';
        }

        async read(): Promise<string> {
          return '';
        }

        async write(_content: string): Promise<void> {
          // No implementation needed for stub
        }
      },
    );

    // Set up default behaviors
    const exists = options.exists ?? false;
    const initialContent = options.initialContent || '{}';

    mock.exists.resolves(exists);
    mock.getConfigPath.returns('in-memory');

    if (exists) {
      mock.read.resolves(initialContent);
    } else {
      mock.read.rejects(new Error('ENOENT: no such file or directory'));
    }

    // Set up default write behavior
    mock.write.resolves();

    // Handle error scenarios
    if (options.readError) {
      mock.read.rejects(options.readError);
    }

    if (options.writeError) {
      mock.write.rejects(options.writeError);
    }

    return mock;
  },
};
