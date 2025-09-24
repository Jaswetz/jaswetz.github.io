import js from '@eslint/js';
import globals from 'globals';
import vitest from 'eslint-plugin-vitest';

export default [
  {
    ignores: [
      'dist/',
      'dev-build/',
      '.parcel-cache/',
      'node_modules/',
      '**/*.min.js',
      'src/assets/js/vendor/',
    ],
  },
  // Source files (browser environment)
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
      'no-console': 'warn',
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-var': 'error',
      'prefer-const': 'error',
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
  // Test files (Vitest environment)
  {
    files: ['tests/**/*.js', 'test-setup.js', '**/*.test.js'],
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
