// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import {
  isNavGroupActive,
  isNavItemActive,
} from '../NavConnectedContent.active';

const MEMBERS = '/backoffice/admin/membres';
const membersItem = (role: string) => ({
  href: MEMBERS,
  queryParams: `?role=${role}&zone=PARIS`,
});

describe('isNavItemActive', () => {
  it('is active on the exact path of the link', () => {
    expect(
      isNavItemActive('/backoffice/events', { href: '/backoffice/events' })
    ).toBe(true);
  });

  it('ignores the page query and anchor when the link has no filter', () => {
    expect(
      isNavItemActive('/backoffice/annuaire?search=a#top', {
        href: '/backoffice/annuaire',
      })
    ).toBe(true);
  });

  it('stays active on a sub page of the link', () => {
    expect(
      isNavItemActive('/backoffice/events/42', { href: '/backoffice/events' })
    ).toBe(true);
  });

  it('does not match a path that only shares a prefix', () => {
    expect(
      isNavItemActive('/backoffice/events-archive', {
        href: '/backoffice/events',
      })
    ).toBe(false);
  });

  it('is not active on another page', () => {
    expect(
      isNavItemActive('/backoffice/dashboard', { href: '/backoffice/events' })
    ).toBe(false);
  });

  it('tolerates a trailing slash on the page', () => {
    expect(
      isNavItemActive('/backoffice/events/', { href: '/backoffice/events' })
    ).toBe(true);
  });

  [undefined, '', '#', 'https://toolbox.example.org'].forEach((href) => {
    it(`is never active for the link ${JSON.stringify(href)}`, () => {
      expect(isNavItemActive('/backoffice/dashboard', { href })).toBe(false);
      expect(isNavItemActive('/backoffice/events', { href })).toBe(false);
    });
  });

  describe('members entries sharing one path', () => {
    it('only activates the entry whose role filter is in the page query', () => {
      const page = `${MEMBERS}?role=Coach&zone=PARIS`;
      expect(isNavItemActive(page, membersItem('Candidate'))).toBe(false);
      expect(isNavItemActive(page, membersItem('Coach'))).toBe(true);
      expect(isNavItemActive(page, membersItem('Referer'))).toBe(false);
    });

    it('does not depend on the zone value', () => {
      expect(
        isNavItemActive(
          `${MEMBERS}?role=Coach&zone=LILLE`,
          membersItem('Coach')
        )
      ).toBe(true);
    });

    it('activates none of them on a member detail page without filter', () => {
      const page = `${MEMBERS}/some-member-id`;
      expect(isNavItemActive(page, membersItem('Candidate'))).toBe(false);
      expect(isNavItemActive(page, membersItem('Coach'))).toBe(false);
      expect(isNavItemActive(page, membersItem('Referer'))).toBe(false);
    });
  });
});

describe('isNavGroupActive', () => {
  const resources = {
    name: 'Ressources',
    subMenu: [
      { href: process.env.UNSET_TOOLBOX_URL || '', name: 'Boîte à outils' },
      { href: '/backoffice/ressources/formations', name: 'Formations' },
    ],
  };

  it('is active when one sub entry is the current page', () => {
    expect(
      isNavGroupActive('/backoffice/ressources/formations', resources)
    ).toBe(true);
  });

  it('is not active on an unrelated page, even with an empty toolbox link', () => {
    expect(isNavGroupActive('/backoffice/dashboard', resources)).toBe(false);
  });

  it('is active when the entry itself is the current page', () => {
    expect(
      isNavGroupActive('/backoffice/events', { href: '/backoffice/events' })
    ).toBe(true);
  });
});
