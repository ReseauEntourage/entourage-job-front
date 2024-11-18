export const isSuspiciousMessage = (message: string): boolean => {
  const forbiddenExpressions =
    process.env.MESSAGING_FORBIDDEN_EXPRESSIONS?.split(',') || [];

  if (forbiddenExpressions.length === 0) {
    return false;
  }
  const forbiddenPattern = new RegExp(
    `\\b(${forbiddenExpressions.map((expr) => expr.trim()).join('|')})\\b`,
    'i'
  );
  return forbiddenPattern.test(message);
};
