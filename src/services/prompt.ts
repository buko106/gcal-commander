import { confirm, select } from '@inquirer/prompts';

import { IPromptService, SelectChoice } from '../interfaces/services';

export class InquirerPromptService implements IPromptService {
  public async confirm(message: string, defaultValue = true): Promise<boolean> {
    return confirm({
      message,
      default: defaultValue,
    });
  }

  public async select(message: string, choices: SelectChoice[]): Promise<string> {
    return select({
      message,
      choices,
    });
  }
}

let promptServiceInstance: IPromptService = new InquirerPromptService();

export function getPromptService(): IPromptService {
  return promptServiceInstance;
}

export function setPromptService(service: IPromptService): void {
  promptServiceInstance = service;
}