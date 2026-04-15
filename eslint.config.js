//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      'import/no-cycle': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      'pnpm/json-enforce-catalog': 'off',
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
    },
  },
  {
    ignores: ['eslint.config.js', 'prettier.config.js'],
  },
]
