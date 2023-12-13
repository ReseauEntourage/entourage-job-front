import Link from 'next/link';
import React from 'react';
import { Img } from 'src/components/utils/Img';

interface NavbarLogoProps {
  href: string;
  src: string;
  alt?: string;
}

export const NavbarLogo = ({ href, src, alt }: NavbarLogoProps) => {
  return (
    <Link href={href} passHref>
      <a className="uk-margin-small-left uk-margin-small-right uk-flex-center uk-flex">
        <Img
          width={180}
          height={50}
          src={src}
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          alt={alt}
        />
      </a>
    </Link>
  );
};
