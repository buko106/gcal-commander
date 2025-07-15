import {includeIgnoreFile} from '@eslint/compat'
import oclif from 'eslint-config-oclif'
import prettier from 'eslint-config-prettier'
import vitest from 'eslint-plugin-vitest'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const gitignorePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.gitignore')

export default [
  includeIgnoreFile(gitignorePath),
  ...oclif,
  prettier,
  {
    rules: {
      'perfectionist/sort-objects': 'off',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@inquirer/prompts',
              message: 'Use src/services/prompt.ts instead of direct @inquirer/prompts import',
            },
            {
              name: 'i18next',
              message: 'Use src/services/i18n.ts (I18nService) instead of direct i18next import',
            },
            {
              name: 'i18next-fs-backend',
              message: 'Use src/services/i18n.ts (I18nService) instead of direct i18next-fs-backend import',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['bin/dev.js', 'bin/run.js'],
    rules: {
      'n/no-unpublished-require': 'off',
      'n/no-missing-require': 'off',
    },
  },
  {
    files: ['src/services/prompt.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['src/services/i18n.ts'],
    rules: {
      'no-restricted-imports': 'off',
      'import/no-named-as-default-member': 'off',
    },
  },
  {
    files: ['test/**/*.test.ts'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/prefer-to-be': 'error',
      'vitest/prefer-to-contain': 'error',
      'vitest/prefer-to-have-length': 'error',
    },
  },
]
