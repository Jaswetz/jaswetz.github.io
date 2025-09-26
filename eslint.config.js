import js from '@eslint/js';
import globals from 'globals';
import vitest from 'eslint-plugin-vitest';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      'dist/',
      'dev-build/',
      '.parcel-cache/',
      'node_modules/',
      '**/*.min.js',
      'src/assets/js/vendor/',
      'src/js/analytics/', // Exclude analytics files from linting
    ],
  },
  // Source files (browser environment) - JavaScript
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        HTMLElement: 'readonly',
        customElements: 'readonly',
        ShadowRoot: 'readonly',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-var': 'error',
      'prefer-const': 'error',
      // Project-specific rules
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unused-labels': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'prefer-promise-reject-errors': 'error',
      'require-await': 'error',
      'no-floating-decimal': 'error',
      'no-unsafe-negation': 'error',
    },
  },
  // TypeScript files
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json', // Assumes you have a tsconfig.json
      },
      globals: {
        ...globals.browser,
        HTMLElement: 'readonly',
        customElements: 'readonly',
        ShadowRoot: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs['recommended-requiring-type-checking'].rules,
      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // Project-specific TypeScript rules
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
    },
  },
  // Script files (Node.js environment)
  {
    files: ['scripts/**/*.js', '*.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off', // Allow console logs in scripts
    },
  },
  // Logger files (allow all console methods)
  {
    files: ['src/js/logger.js', 'src/js/utils/Logger.js'],
    rules: {
      'no-console': 'off', // Allow all console methods in logger files
    },
  },
  // Test files (Vitest environment)
  {
    files: [
      'tests/**/*.js',
      'tests/**/*.ts',
      'test-setup.js',
      '**/*.test.js',
      '**/*.test.ts',
    ],
    ...vitest.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.node,
        ...vitest.environments.env.globals,
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'no-console': 'off',
    },
  },
];
