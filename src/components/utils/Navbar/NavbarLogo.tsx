import Link from 'next/link';
import React from 'react';
import { Img } from 'src/components/utils/Img';

interface NavbarLogoProps {
  href: string;
  src: string;
  alt?: string;
  style?: React.CSSProperties;
}

export const NavbarLogo = ({ href, src, alt, style }: NavbarLogoProps) => {
  return (
    <Link href={href} passHref>
      <div style={{ width: 180 }}>
        <a // info: regle css sur uk-logo
          className="uk-navbar-item"
          style={style}
        >
          <Img src={src} alt={alt} />
        </a>
      </div>
    </Link>
  );
};
