import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { StyledHeaderDesktop } from 'src/components/headers/Header.styles';
import { Nav, Navbar, NavbarLogo } from 'src/components/utils';
import { Button } from 'src/components/utils/Button';
import { GA_TAGS } from 'src/constants/tags';
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
        <Link href={link.href} key={i} legacyBehavior>
          <StyledPublicItem color="white">{link.name}</StyledPublicItem>
        </Link>
      );
    }),
    <div>
      <Button
        href="/login"
        variant="secondary"
        rounded
        onClick={() => {
          gaEvent(GA_TAGS.HEADER_CONNEXION_CLIC);
        }}
        size="small"
      >
        Connexion
      </Button>
    </div>,
    <div>
      <Button
        href="/inscription"
        variant="primary"
        rounded
        size="small"
        onClick={() => {
          gaEvent(GA_TAGS.HEADER_INSCRIPTION_CLIC);
        }}
      >
        Inscription
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
