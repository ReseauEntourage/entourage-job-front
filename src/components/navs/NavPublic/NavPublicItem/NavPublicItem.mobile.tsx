import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { gaEvent } from '@/src/lib/gtag';
import { StyledNavPublicItemMobileLinkContainer } from './NavPublicItem.styles';
import { NavPublicItemProps } from './NavPublicItem.types';

export const NavPublicItemMobile = ({ item, onClick }: NavPublicItemProps) => {
  const { asPath } = useRouter();
  const isExactPath = asPath === item.href;

  // Generate <Link> or simple text if not necessary
  let link: React.ReactNode = item.name;
  if (item.href) {
    link = (
      <StyledNavPublicItemMobileLinkContainer selected={isExactPath}>
        <Link
          className="uk-text-center"
          href={item.href || '#'}
          onClick={() => {
            gaEvent(item.tag);
            if (onClick) {
              onClick();
            }
          }}
        >
          {item.name}
        </Link>
      </StyledNavPublicItemMobileLinkContainer>
    );
  }

  // Generate menu item containing the <Link>
  const menuItem = <li className="uk-flex-center">{link}</li>;

  if (item.childrens && item.childrens.length > 0) {
    return (
      <>
        {item.childrens.map((child) => {
          const isChildPath = child.href === asPath;

          return (
            <li className="uk-flex-center" key={child.name}>
              <StyledNavPublicItemMobileLinkContainer
                selected={isChildPath}
                key={child.name}
              >
                <Link href={child.href || '#'} key={child.name}>
                  {child.name}
                </Link>
              </StyledNavPublicItemMobileLinkContainer>
            </li>
          );
        })}
      </>
    );
  }

  // Return a simple menuItem
  return menuItem;
};
