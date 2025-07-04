export interface IConfigStorage {
  exists(): Promise<boolean>;
  getConfigPath(): string;
  read(): Promise<string>;
  write(content: string): Promise<void>;
}
