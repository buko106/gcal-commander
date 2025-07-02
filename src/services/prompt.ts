import { confirm } from '@inquirer/prompts';

import { IPromptService } from '../interfaces/services';

export class InquirerPromptService implements IPromptService {
  public async confirm(message: string, defaultValue = true): Promise<boolean> {
    return confirm({
      message,
      default: defaultValue,
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