import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

const CONFIG_PATH = join(homedir(), '.gcal-commander', 'config.json');

export interface Config extends Record<string, unknown> {
  defaultCalendar?: string;
  events?: {
    days?: number;
    format?: 'json' | 'table';
    maxResults?: number;
  };
}

export class ConfigService {
  private static instance: ConfigService;
  private config: Config = {};
  private loaded = false;

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }

    return ConfigService.instance;
  }

  public async get<T>(key: string): Promise<T | undefined> {
    await this.load();
    return this.getNestedValue(this.config, key) as T;
  }

  public getConfigPath(): string {
    return CONFIG_PATH;
  }

  public async list(): Promise<Config> {
    await this.load();
    return { ...this.config };
  }

  public async load(): Promise<void> {
    if (this.loaded) return;

    try {
      const content = await readFile(CONFIG_PATH, 'utf8');
      this.config = JSON.parse(content);
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
    const configDir = join(homedir(), '.gcal-commander');
    await mkdir(configDir, { recursive: true });
    await writeFile(CONFIG_PATH, JSON.stringify(this.config, null, 2), 'utf8');
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
    const validKeys = [
      'defaultCalendar',
      'events.maxResults',
      'events.format',
      'events.days',
    ];
    return validKeys.includes(key);
  }

  public validateValue(key: string, value: unknown): { error?: string; valid: boolean; } {
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
        if (value !== 'table' && value !== 'json') {
          return { error: 'events.format must be either "table" or "json"', valid: false };
        }

        break;
      }

      case 'events.maxResults': {
        if (typeof value !== 'number' || value < 1 || value > 100) {
          return { error: 'events.maxResults must be a number between 1 and 100', valid: false };
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