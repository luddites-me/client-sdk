module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint-config-airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.spec.ts', '**/*-spec.ts', 'test/**/*'],
      env: {
        mocha: true,
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'import/extensions': ['error', { '.ts': 'ignorePackages' }],
    'linebreak-style': 'off',
    'no-confusing-arrow': 'off',
    'no-multiple-empty-lines': 'error',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'prettier/prettier': 'error',
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
};
