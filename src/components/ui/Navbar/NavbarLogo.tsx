import React from 'react';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import { StyledNavbarLogo } from './NavbarLogo.styles';

interface NavbarLogoProps {
  href: string;
  type: 'primary' | 'secondary';
  width?: number;
  height?: number;
}

export const NavbarLogo = ({
  href,
  type,
  width = 180,
  height = 60,
}: NavbarLogoProps) => {
  return (
    <StyledNavbarLogo href={href}>
      {type === 'primary' ? (
        <SvgIcon name="EntourageProLogoPrimary" width={width} height={height} />
      ) : (
        <SvgIcon
          name="EntourageProLogoSecondary"
          width={width}
          height={height}
        />
      )}
    </StyledNavbarLogo>
  );
};
