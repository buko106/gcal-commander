import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

import { SUPPORTED_LANGUAGES } from '../constants/languages';
import { TOKENS } from '../di/tokens';
import { IConfigStorage } from '../interfaces/config-storage';
import { Config, IConfigService } from '../interfaces/services';

const configValueSchema = z.object({
  defaultCalendar: z.string(),
  language: z.enum(SUPPORTED_LANGUAGES),
  'events.days': z.number().min(1).max(365),
  'events.format': z.enum(['table', 'json', 'pretty-json']),
  'events.maxResults': z.number().min(1).max(100),
});

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
      const exists = await this.configStorage.exists();

      if (exists) {
        const content = await this.configStorage.read();
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
    const content = JSON.stringify(this.config, null, 2);
    await this.configStorage.write(content);
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

  public validateValue(
    key: string,
    value: unknown,
  ): { error?: string; errorKey?: string; errorOptions?: unknown; valid: boolean } {
    if (!this.validateKey(key)) {
      return {
        errorKey: 'config.validation.unknownKey',
        errorOptions: { key },
        valid: false,
      };
    }

    try {
      const schema = configValueSchema.shape[key as keyof typeof configValueSchema.shape];
      schema.parse(value);
      return { valid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map((e) => e.message).join(', ');

        return {
          errorKey: 'config.validation.zodError',
          errorOptions: { key, message },
          valid: false,
        };
      }

      return {
        errorKey: 'config.validation.invalidValue',
        errorOptions: { key },
        valid: false,
      };
    }
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
