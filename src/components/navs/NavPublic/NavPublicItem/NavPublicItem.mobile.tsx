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
  let link: React.ReactNode = <span>{item.name}</span>;
  if (item.href) {
    link = (
      <StyledNavPublicItemMobileLinkContainer selected={isExactPath}>
        <Link
          className="uk-text-center"
          href={item.href || '#'}
          onClick={() => {
            gaEvent(item.tag);
            if (onClick) onClick();
          }}
        >
          {item.name}
        </Link>
      </StyledNavPublicItemMobileLinkContainer>
    );
  }

  if (item.childrens && item.childrens.length > 0) {
    return (
      <>
        {item.childrens.map((child) => {
          const isChildPath = child.href === asPath;
          return (
            <StyledNavPublicItemMobileLinkContainer
              selected={isChildPath}
              key={child.name}
            >
              <Link href={child.href || '#'} key={child.name}>
                {child.name}
              </Link>
            </StyledNavPublicItemMobileLinkContainer>
          );
        })}
      </>
    );
  }

  return <>{link}</>;
};
