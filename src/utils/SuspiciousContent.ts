export const isSuspiciousMessage = (message: string): boolean => {
  const forbiddenExpressions =
    process.env.NEXT_PUBLIC_MESSAGING_FORBIDDEN_EXPRESSIONS?.split(',') || [];

  if (forbiddenExpressions.length === 0) {
    return false;
  }
  const forbiddenPattern = new RegExp(
    `\\b(${forbiddenExpressions.map((expr) => expr.trim()).join('|')})\\b`,
    'i'
  );
  return forbiddenPattern.test(message);
};

/**
 * Whether a link points to one of the verified domains
 * (`NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS`): other links open only after the
 * "Vous quittez le réseau Entourage Pro" confirmation.
 */
export const isVerifiedLinkDomain = (href: string): boolean => {
  const whitelist =
    process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS?.split(',') || [];
  const domainMatch = href.match(/https?:\/\/(www\.)?([\w.-]+)/i);
  const domain = domainMatch ? domainMatch[2] : '';
  return whitelist.some((whitelistedDomain) =>
    domain.endsWith(whitelistedDomain)
  );
};
