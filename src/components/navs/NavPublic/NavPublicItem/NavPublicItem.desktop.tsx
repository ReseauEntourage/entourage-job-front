import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Dropdown } from '@/src/components/utils';
import { DropdownToggle } from '@/src/components/utils/Dropdown/DropdownToggle';
import { gaEvent } from '@/src/lib/gtag';
import { StyledPublicItem } from '../NavPublic.styles';
import { StyledPublicItemMenuItem } from './NavPublicItem.styles';
import { NavPublicItemProps } from './NavPublicItem.types';

export const NavPublicItemDesktop = ({ item }: NavPublicItemProps) => {
  const { asPath } = useRouter();
  const isExactPath = asPath === item.href;
  const isChildPath =
    item.childrens && item.childrens.some((child) => child.href === asPath);

  // Generate <Link> or simple text if not necessary
  let link: React.ReactNode = item.name;
  if (item.href) {
    link = <Link href={item.href || '#'}>{item.name}</Link>;
  }

  // Generate menu Item
  const menuItem = (
    <StyledPublicItem
      color="white"
      onClick={() => {
        gaEvent(item.tag);
      }}
      selected={isExactPath || isChildPath}
      isMenu={!!(item.childrens && item.childrens.length > 0)}
    >
      {link}
    </StyledPublicItem>
  );

  // Return a menuItem with a dropdown for children if got one
  if (item.childrens && item.childrens.length > 0) {
    return (
      <Dropdown key={item.name}>
        <DropdownToggle>{menuItem}</DropdownToggle>
        <Dropdown.Menu openDirection="right">
          {item.childrens.map((child) => (
            <Dropdown.Item
              key={child.name}
              onClick={() => {
                gaEvent(child.tag);
              }}
            >
              <StyledPublicItemMenuItem>
                <Link href={child.href || '#'}>{child.name}</Link>
              </StyledPublicItemMenuItem>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  // Return a simple menuItem
  return menuItem;
};
