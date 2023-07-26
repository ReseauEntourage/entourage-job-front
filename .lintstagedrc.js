module.exports = {
  '*.ts?(x)': ['yarn tsc-files', 'yarn lint:fix'],
  '*.js?(x)': 'yarn lint:fix',
};
