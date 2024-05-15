module.exports = {
  'src/**/*.ts?(x)': [() => 'yarn test:ts-check', 'yarn test:eslint'],
  'src/**/*.js?(x)': () => 'yarn test:eslint',
};
