import type { NavConnectedMainItem } from '../NavConnected.types';

type ActiveCheckedItem = Pick<NavConnectedMainItem, 'href' | 'queryParams'>;

const ROLE_PARAM = 'role';

const splitPath = (path: string) => {
  const [withoutHash] = path.split('#');
  const [pathname, query = ''] = withoutHash.split('?');
  return {
    // A trailing slash must not make a page different from its link
    pathname: pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname,
    params: new URLSearchParams(query),
  };
};

const hasSameRoles = (itemRoles: string[], pageRoles: string[]) => {
  const sortedPageRoles = [...pageRoles].sort();
  return (
    itemRoles.length === pageRoles.length &&
    [...itemRoles]
      .sort()
      .every((role, index) => role === sortedPageRoles[index])
  );
};

/**
 * Tells whether a menu entry is the current page.
 *
 * An entry is active when the page is its link or one of its sub pages
 * (matched on segment boundaries: `/backoffice/events/42` activates
 * `/backoffice/events`, `/backoffice/events-x` does not). Entries that carry a
 * `role` filter, such as the members lists, also need the same filter in the
 * page query. An empty, anchor-only or external link is never active.
 */
export const isNavItemActive = (
  asPath: string,
  { href, queryParams }: ActiveCheckedItem
): boolean => {
  if (!href || href === '#' || !href.startsWith('/')) {
    return false;
  }
  const page = splitPath(asPath);
  const link = splitPath(href);
  const isSamePathOrSubPage =
    page.pathname === link.pathname ||
    page.pathname.startsWith(`${link.pathname}/`);
  if (!isSamePathOrSubPage) {
    return false;
  }
  const itemRoles = new URLSearchParams(queryParams || '').getAll(ROLE_PARAM);
  if (itemRoles.length === 0) {
    return true;
  }
  return hasSameRoles(itemRoles, page.params.getAll(ROLE_PARAM));
};

/**
 * Tells whether a menu entry, or one of its sub menu entries, is the current
 * page. Used to highlight the parent of an active sub entry.
 */
export const isNavGroupActive = (
  asPath: string,
  item: Pick<NavConnectedMainItem, 'href' | 'queryParams' | 'subMenu'>
): boolean =>
  isNavItemActive(asPath, item) ||
  !!item.subMenu?.some((subItem) => isNavItemActive(asPath, subItem));
