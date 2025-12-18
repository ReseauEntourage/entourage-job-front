module.exports = {
  'src/**/*.ts?(x)': [() => 'pnpm run test:ts-check', 'eslint --fix'],
  'src/**/*.js?(x)': () => 'pnpm run test:eslint',
};
