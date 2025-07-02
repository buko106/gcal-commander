import { runCommand } from '@oclif/test';
import { expect } from 'chai';
import * as sinon from 'sinon';

import type { IPromptService } from '../../src/interfaces/services';

import { TestContainerFactory } from '../../src/test-utils/mock-factories/test-container-factory';

describe('init command', () => {
  let mockPromptService: IPromptService & sinon.SinonStubbedInstance<IPromptService>;

  beforeEach(() => {
    const { mocks } = TestContainerFactory.create();
    mockPromptService = mocks.promptService;
  });

  afterEach(() => {
    TestContainerFactory.cleanup();
  });

  it('should display confirmation message when user confirms', async () => {
    mockPromptService.confirm.resolves(true);

    const { stdout, stderr } = await runCommand('init');

    expect(stderr).to.contain('Do you want to continue?');
    expect(stdout).to.contain('Input confirmed successfully!');
  });

  it('should display cancellation message when user declines', async () => {
    mockPromptService.confirm.resolves(false);

    const { stdout, stderr } = await runCommand('init');

    expect(stderr).to.contain('Do you want to continue?');
    expect(stdout).to.contain('Operation cancelled.');
  });

  it('should use default value (yes) when no input provided', async () => {
    // Default behavior from factory should be true
    const { stdout } = await runCommand('init');

    expect(stdout).to.contain('Input confirmed successfully!');
  });
});