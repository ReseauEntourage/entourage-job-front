import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { gaEvent } from '@/src/lib/gtag';
import { StyledNavPublicItemMobileLinkContainer } from './NavPublicItem.styles';
import { NavPublicItemProps } from './NavPublicItem.types';

export const NavPublicItemMobile = ({ item, onClick }: NavPublicItemProps) => {
  const { asPath } = useRouter();
  const isExactPath = asPath === item.href;

  if (item.childrens && item.childrens.length > 0) {
    return (
      <>
        {item.childrens.map((child) => {
          const isChildPath = child.href === asPath;

          return (
            <li key={child.name}>
              <StyledNavPublicItemMobileLinkContainer
                selected={isChildPath}
                $isChild
              >
                <Link
                  href={child.href || '#'}
                  onClick={() => {
                    gaEvent(child.tag);
                    if (onClick) {
                      onClick();
                    }
                  }}
                >
                  {child.name}
                </Link>
              </StyledNavPublicItemMobileLinkContainer>
            </li>
          );
        })}
      </>
    );
  }

  if (!item.href) {
    return null;
  }

  return (
    <li>
      <StyledNavPublicItemMobileLinkContainer selected={isExactPath}>
        <Link
          href={item.href}
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
    </li>
  );
};
