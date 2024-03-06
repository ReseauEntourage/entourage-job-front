import Link from 'next/link';
import React from 'react';
import {
  EntourageProLogoPrimary,
  EntourageProLogoSecondary,
} from 'assets/icons/icons';
import { Img } from 'src/components/utils/Img';

interface NavbarLogoProps {
  href: string;
  type: 'primary' | 'secondary';
}

export const NavbarLogo = ({ href, type }: NavbarLogoProps) => {
  return (
    <Link href={href} passHref>
      <a className="uk-margin-small-left uk-margin-small-right uk-flex-center uk-flex">
        {type === 'primary' ? (
          <EntourageProLogoPrimary width={180} height={60} />
        ) : (
          <EntourageProLogoSecondary width={180} height={60} />
        )}
      </a>
    </Link>
  );
};
