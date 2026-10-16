// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { isVerifiedLinkDomain } from './SuspiciousContent';

describe('isVerifiedLinkDomain', () => {
  const originalSafeDomains = process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS;

  beforeAll(() => {
    process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS =
      ' entourage-pro.fr , Entourage.social';
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS = originalSafeDomains;
  });

  it('accepts a verified domain and its subdomains', () => {
    expect(isVerifiedLinkDomain('https://entourage-pro.fr/aide')).toBe(true);
    expect(isVerifiedLinkDomain('https://www.entourage-pro.fr')).toBe(true);
    expect(isVerifiedLinkDomain('http://blog.entourage.social/x')).toBe(true);
  });

  it('refuses a host which only ends with a verified domain', () => {
    expect(isVerifiedLinkDomain('https://evil-entourage-pro.fr')).toBe(false);
    expect(isVerifiedLinkDomain('https://entourage-pro.fr.evil.com')).toBe(
      false
    );
  });

  it('refuses an unparsable address', () => {
    expect(isVerifiedLinkDomain('not a url')).toBe(false);
  });
});
