module.exports = {
  '*.ts?(x)': [() => 'yarn test:ts-check', 'yarn test:eslint'],
  '*.js?(x)': () => 'yarn test:eslint',
};
