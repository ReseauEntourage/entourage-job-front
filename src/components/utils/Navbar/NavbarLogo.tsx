import Link from 'next/link';
import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';

interface NavbarLogoProps {
  href: string;
  type: 'primary' | 'secondary';
}

export const NavbarLogo = ({ href, type }: NavbarLogoProps) => {
  return (
    <Link
      href={href}
      className="uk-margin-small-left uk-margin-small-right uk-flex-center uk-flex"
    >
      {type === 'primary' ? (
        <SvgIcon name="EntourageProLogoPrimary" width={180} height={60} />
      ) : (
        <SvgIcon name="EntourageProLogoSecondary" width={180} height={60} />
      )}
    </Link>
  );
};
