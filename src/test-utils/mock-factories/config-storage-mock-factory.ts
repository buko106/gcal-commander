import * as sinon from 'sinon';

import { IConfigStorage } from '../../interfaces/config-storage';

export interface ConfigStorageMockOptions {
  configPath?: string;
  initialData?: Record<string, string>;
  readError?: Error;
  writeError?: Error;
}

export const ConfigStorageMockFactory = {
  create(options: ConfigStorageMockOptions = {}): IConfigStorage & sinon.SinonStubbedInstance<IConfigStorage> {
    const mock = sinon.createStubInstance<IConfigStorage>(class implements IConfigStorage {
      async exists(_path: string): Promise<boolean> { 
        return false; 
      }

      getConfigPath(): string { 
        return ''; 
      }

      async read(_path: string): Promise<string> { 
        return ''; 
      }

      async write(_path: string, _content: string): Promise<void> { 
        // No implementation needed for stub
      }
    });
    
    // Set up default behaviors
    const configPath = options.configPath || '/tmp/test-config.json';
    mock.getConfigPath.returns(configPath);
    
    // Set up initial data
    const initialData = options.initialData || {};
    for (const [path, content] of Object.entries(initialData)) {
      mock.read.withArgs(path).resolves(content);
      mock.exists.withArgs(path).resolves(true);
    }
    
    // Set up default exists behavior (false for unknown paths)
    mock.exists.callsFake(async (path: string) => Object.hasOwn(initialData, path));
    
    // Set up default read behavior (throw for unknown paths)
    mock.read.callsFake(async (path: string) => {
      if (Object.hasOwn(initialData, path)) {
        return initialData[path];
      }

      throw new Error(`ENOENT: no such file or directory, open '${path}'`);
    });
    
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