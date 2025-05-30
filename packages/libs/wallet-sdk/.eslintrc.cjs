// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['@kadena-dev/eslint-config/profile/lib'],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    '@rushstack/no-new-null': 'off',
    'no-console': 'warn',
  },
  ignorePatterns: ['rollup.config.mjs', 'vitest.config.ts', 'codegen.ts'],
};
