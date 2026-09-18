import Link from 'next/link';
import React from 'react';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';

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
    <Link
      href={href}
      className="uk-margin-small-left uk-margin-small-right uk-flex"
    >
      {type === 'primary' ? (
        <SvgIcon name="EntourageProLogoPrimary" width={width} height={height} />
      ) : (
        <SvgIcon
          name="EntourageProLogoSecondary"
          width={width}
          height={height}
        />
      )}
    </Link>
  );
};
