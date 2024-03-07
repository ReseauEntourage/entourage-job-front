import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import ChevronRightIcon from 'assets/icons/chevron-right.svg';
import { StyledHeaderDesktop } from 'src/components/headers/Header.styles';
import { Navbar, NavbarLogo, Nav } from 'src/components/utils';
import { Button } from 'src/components/utils/Button';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { StyledPublicItem } from './HeaderPublicContent.styles';
import { HeaderPublicContentProps } from './HeaderPublicContent.types';

export const HeaderPublicContentDesktop = ({
  links,
}: HeaderPublicContentProps) => {
  const { asPath } = useRouter();

  const rightItems = [
    ...links.map((link, i) => {
      if (asPath.includes(link.href)) {
        return (
          <div>
            <StyledPublicItem
              selected
              href={link.href}
              color="white"
              onClick={() => {
                gaEvent(link.tag);
              }}
            >
              {link.name}
            </StyledPublicItem>
          </div>
        );
      }
      return (
        <Link href={link.href} key={i}>
          <StyledPublicItem color="white">{link.name}</StyledPublicItem>
        </Link>
      );
    }),
    <div>
      <Button
        href="/login"
        style="custom-secondary-inverted"
        size="small"
      >
        Inscription / Connexion
      </Button>
    </div>,
  ];
  return (
    <StyledHeaderDesktop id="header">
      <Navbar
        backgroundColor="darkerBlack"
        sticky
        left={
          <div className="uk-flex uk-flex-middle">
            <NavbarLogo href="/" type="secondary" />
          </div>
        }
        right={<Nav items={rightItems} color="white" />}
      />
    </StyledHeaderDesktop>
  );
};
