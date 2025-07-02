export interface IConfigStorage {
  exists(path: string): Promise<boolean>;
  getConfigPath(): string;
  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<void>;
}