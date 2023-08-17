module.exports = {
  '*.ts?(x)': [() => 'yarn ts-check', 'yarn lint:fix'],
  '*.js?(x)': 'yarn lint:fix',
};
