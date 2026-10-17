import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist', 'coverage'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Components are capitalised and used only in JSX, which this rule cannot see.
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // DESIGN §6.2 rule 1: only vehicleService may touch the seed data.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/data/seedVehicles', '**/data/seedVehicles.js'],
              message: 'Only src/services/vehicleService.js may import seed data (DESIGN §6.2).',
            },
          ],
        },
      ],
      // NFR-22: never render HTML from strings or evaluate code.
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'dangerouslySetInnerHTML is forbidden (NFR-22).',
        },
      ],
    },
  },
  {
    files: ['src/services/vehicleService.js'],
    rules: { 'no-restricted-imports': 'off' },
  },
  {
    // Context files export a provider component and its hook together.
    files: ['src/context/**/*.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    // Tests may use the seed data as a fixture and export test helpers.
    files: ['src/test/**', 'src/**/*.test.{js,jsx}'],
    rules: {
      'no-restricted-imports': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
];
