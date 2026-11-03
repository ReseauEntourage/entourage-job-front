// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import {
  getValidRequestedPath,
  resolveOnboardingExitPath,
} from './onboardingExitPath';

describe('resolveOnboardingExitPath', () => {
  it('keeps a backoffice page', () => {
    expect(resolveOnboardingExitPath('/backoffice/events')).toBe(
      '/backoffice/events'
    );
  });

  it('keeps the query and hash of a backoffice page', () => {
    expect(
      resolveOnboardingExitPath('/backoffice/annuaire?role=Coach#top')
    ).toBe('/backoffice/annuaire?role=Coach#top');
  });

  const rejectedValues: [string, unknown][] = [
    ['a protocol-relative URL', '//evil.example/backoffice/events'],
    ['a backslash URL', '/\\evil.example'],
    ['an absolute URL', 'https://evil.example/backoffice/events'],
    ['the wizard itself', '/wizard/run'],
    ['a public page', '/candidats'],
    ['the backoffice root without a page', '/backoffice'],
    ['an empty value', ''],
    ['a missing value', undefined],
    ['an array value', ['/backoffice/events']],
  ];
  rejectedValues.forEach(([label, value]) => {
    it(`falls back to the dashboard for ${label}`, () => {
      expect(resolveOnboardingExitPath(value)).toBe('/backoffice/dashboard');
      expect(getValidRequestedPath(value)).toBeNull();
    });
  });
});
