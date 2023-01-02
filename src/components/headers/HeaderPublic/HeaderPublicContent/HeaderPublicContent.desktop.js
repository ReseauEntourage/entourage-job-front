import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Navbar } from 'src/components/utils';

import Button from 'src/components/utils/Button';
import { gaEvent } from 'src/lib/gtag';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { IconNoSSR } from 'src/components/utils/Icon';
import { fbEvent } from 'src/lib/fb';
import PropTypes from 'prop-types';
import NavbarLogo from 'src/components/utils/Navbar/NavbarLogo';
import Nav from 'src/components/utils/Navbar/Nav';
import { StyledHeaderDesktop } from '../../Header.styles';
import { HeaderPublicItemShape } from '../HeaderPublic.shapes';
import { StyledPublicItem } from './HeaderPublicContent.styles';

const HeaderPublicDesktop = ({ links }) => {
  const router = useRouter();

  const rightItems = [
    ...links.map((link, i) => {
      if (router.asPath.includes(link.href)) {
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
              alt="Linkedout"
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