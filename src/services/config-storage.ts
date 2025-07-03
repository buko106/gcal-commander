import { constants } from 'node:fs';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

import { IConfigStorage } from '../interfaces/config-storage';

export class FileSystemConfigStorage implements IConfigStorage {
  private readonly _getConfigPath = (): string => {
    if (process.env.GCAL_COMMANDER_CONFIG_PATH) {
      return process.env.GCAL_COMMANDER_CONFIG_PATH;
    }

    return join(homedir(), '.gcal-commander', 'config.json');
  };

  public async exists(path: string): Promise<boolean> {
    try {
      await access(path, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  public getConfigPath(): string {
    return this._getConfigPath();
  }

  public async read(path: string): Promise<string> {
    return readFile(path, 'utf8');
  }

  public async write(path: string, content: string): Promise<void> {
    const configDir = join(path, '..');
    await mkdir(configDir, { recursive: true });
    await writeFile(path, content, 'utf8');
  }
}