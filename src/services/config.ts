import { inject, injectable } from 'tsyringe';

import { TOKENS } from '../di/tokens';
import { IConfigStorage } from '../interfaces/config-storage';
import { Config, IConfigService } from '../interfaces/services';

@injectable()
export class ConfigService implements IConfigService {
  private static readonly VALID_KEYS = [
    'defaultCalendar',
    'language',
    'events.maxResults',
    'events.format',
    'events.days',
  ] as const;
  private config: Config = {};
  private loaded = false;

  constructor(@inject(TOKENS.ConfigStorage) private readonly configStorage: IConfigStorage) {}

  public async get<T>(key: string): Promise<T | undefined> {
    await this.load();
    return this.getNestedValue(this.config, key) as T;
  }

  public getConfigPath(): string {
    return this.configStorage.getConfigPath();
  }

  public getValidKeys(): readonly string[] {
    return ConfigService.VALID_KEYS;
  }

  public async list(): Promise<Config> {
    await this.load();
    return { ...this.config };
  }

  public async load(): Promise<void> {
    if (this.loaded) return;

    try {
      const configPath = this.configStorage.getConfigPath();
      const exists = await this.configStorage.exists(configPath);

      if (exists) {
        const content = await this.configStorage.read(configPath);
        this.config = JSON.parse(content);
      } else {
        this.config = {};
      }
    } catch {
      // If file doesn't exist or is invalid, use empty config
      this.config = {};
    }

    this.loaded = true;
  }

  public async reset(): Promise<void> {
    this.config = {};
    await this.save();
  }

  public async save(): Promise<void> {
    const configPath = this.configStorage.getConfigPath();
    const content = JSON.stringify(this.config, null, 2);
    await this.configStorage.write(configPath, content);
  }

  public async set(key: string, value: unknown): Promise<void> {
    await this.load();
    this.setNestedValue(this.config, key, value);
    await this.save();
  }

  public async unset(key: string): Promise<void> {
    await this.load();
    this.deleteNestedValue(this.config, key);
    await this.save();
  }

  public validateKey(key: string): boolean {
    return ConfigService.VALID_KEYS.includes(key as (typeof ConfigService.VALID_KEYS)[number]);
  }

  public validateValue(key: string, value: unknown): { error?: string; valid: boolean } {
    switch (key) {
      case 'defaultCalendar': {
        if (typeof value !== 'string') {
          return { error: 'defaultCalendar must be a string', valid: false };
        }

        break;
      }

      case 'events.days': {
        if (typeof value !== 'number' || value < 1 || value > 365) {
          return { error: 'events.days must be a number between 1 and 365', valid: false };
        }

        break;
      }

      case 'events.format': {
        if (value !== 'table' && value !== 'json' && value !== 'pretty-json') {
          return { error: 'events.format must be one of "table", "json", or "pretty-json"', valid: false };
        }

        break;
      }

      case 'events.maxResults': {
        if (typeof value !== 'number' || value < 1 || value > 100) {
          return { error: 'events.maxResults must be a number between 1 and 100', valid: false };
        }

        break;
      }

      case 'language': {
        if (typeof value !== 'string' || !['en', 'ja'].includes(value)) {
          return { error: 'language must be one of "en" or "ja"', valid: false };
        }

        break;
      }

      default: {
        return { error: `Unknown configuration key: ${key}`, valid: false };
      }
    }

    return { valid: true };
  }

  private deleteNestedValue(obj: Record<string, unknown>, path: string): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;

    let target: null | Record<string, unknown> = obj as null | Record<string, unknown>;
    for (const key of keys) {
      if (target && typeof target === 'object' && key in target) {
        target = target[key] as Record<string, unknown>;
      } else {
        target = null;
        break;
      }
    }

    if (target && typeof target === 'object') {
      delete target[lastKey];
    }
  }

  private getNestedValue(obj: unknown, path: string): unknown {
    let current = obj;
    for (const key of path.split('.')) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }

    return current;
  }

  private setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;

    let target = obj;
    for (const key of keys) {
      if (!(key in target) || typeof target[key] !== 'object' || target[key] === null) {
        target[key] = {};
      }

      target = target[key] as Record<string, unknown>;
    }

    target[lastKey] = value;
  }
}
