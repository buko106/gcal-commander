import { constants } from 'node:fs';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { IConfigStorage } from '../interfaces/config-storage';
import { AppPaths } from '../utils/paths';

export class FileSystemConfigStorage implements IConfigStorage {
  private readonly configPath: string;

  constructor(configPath?: string) {
    this.configPath = configPath || AppPaths.getConfigPath();
  }

  public async exists(): Promise<boolean> {
    try {
      await access(this.configPath, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  public getConfigPath(): string {
    return this.configPath;
  }

  public async read(): Promise<string> {
    return readFile(this.configPath, 'utf8');
  }

  public async write(content: string): Promise<void> {
    const configDir = dirname(this.configPath);
    await mkdir(configDir, { recursive: true });
    await writeFile(this.configPath, content, 'utf8');
  }
}

export class InMemoryConfigStorage implements IConfigStorage {
  private content: string | undefined;

  public async exists(): Promise<boolean> {
    return this.content !== undefined;
  }

  public getConfigPath(): string {
    return 'in-memory';
  }

  public async read(): Promise<string> {
    if (this.content === undefined) {
      throw new Error(`ENOENT: no such file or directory`);
    }

    return this.content;
  }

  public async write(content: string): Promise<void> {
    this.content = content;
  }
}
