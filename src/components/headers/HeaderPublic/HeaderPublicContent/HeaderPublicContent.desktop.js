import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import { StyledHeaderDesktop } from '../../Header.styles';
import { HeaderPublicItemShape } from '../HeaderPublic.shapes';
import { Navbar, NavbarLogo, IconNoSSR, Nav } from 'src/components/utils';
import { Button } from 'src/components/utils/Button';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { StyledPublicItem } from './HeaderPublicContent.styles';

const HeaderPublicDesktop = ({ links }) => {
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
        href={{
          pathname: '/candidats',
          query: { employed: false },
        }}
        style="primary"
      >
        Découvrir les CV&nbsp;
        <IconNoSSR name="chevron-right" />
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
            <NavbarLogo
              href="/"
              src="/static/img/linkedout_logo_white.png"
              alt="LinkedOut"
            />
            <div className="uk-margin-small-left uk-flex uk-flex-center uk-light">
              <Button
                href={process.env.DONATION_LINK}
                isExternal
                newTab
                onClick={() => {
                  gaEvent(GA_TAGS.HEADER_DON_CLIC);
                  fbEvent(FB_TAGS.DONATION);
                }}
                style="default"
              >
                Faire un don&nbsp;
                <IconNoSSR name="chevron-right" />
              </Button>
            </div>
          </div>
        }
        right={<Nav items={rightItems} color="white" />}
      />
    </StyledHeaderDesktop>
  );
};

HeaderPublicDesktop.propTypes = {
  links: PropTypes.arrayOf(HeaderPublicItemShape).isRequired,
};
export default HeaderPublicDesktop;
