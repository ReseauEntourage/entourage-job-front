module.exports = {
  'src/**/*.ts?(x)': [() => 'pnpm run test:ts-check', 'pnpm run test:eslint'],
  'src/**/*.js?(x)': () => 'pnpm run test:eslint',
};
