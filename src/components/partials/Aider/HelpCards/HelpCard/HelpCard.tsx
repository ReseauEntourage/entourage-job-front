import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';
import ChevronRightIcon from 'assets/icons/chevron-right.svg';
import { Button, Img } from 'src/components/utils';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import {
  StyledHelpCard,
  StyledImageContainer,
  StyledLink,
} from './HelpCard.styles';

export const HelpCard = ({ cardContent, keyMap }) => {
  const { title, img, text, cta, href, alt, newTab, gaTag, fbTag } =
    cardContent;
  const card = (
    <div className="card-content">
      <div>
        <h4>{title}</h4>
        <StyledImageContainer>
          <Img src={img} cover alt={alt} />
        </StyledImageContainer>
        <p>{text}</p>
      </div>
      <Button
        href={href}
        style="primary"
        newTab={newTab}
        isExternal={newTab}
        onClick={() => {
          if (gaTag) gaEvent(gaTag);
          if (fbTag) fbEvent(fbTag);
        }}
      >
        {cta}
        <ChevronRightIcon />
      </Button>
    </div>
  );

  return (
    <StyledHelpCard key={keyMap} className="aider-card">
      {newTab ? (
        <StyledLink
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            if (gaTag) gaEvent(gaTag);
            if (fbTag) fbEvent(fbTag);
          }}
        >
          {card}
        </StyledLink>
      ) : (
        <Link href={href} passHref legacyBehavior>
          <StyledLink
            onClick={() => {
              if (gaTag) gaEvent(gaTag);
              if (fbTag) fbEvent(fbTag);
            }}
          >
            {card}
          </StyledLink>
        </Link>
      )}
    </StyledHelpCard>
  );
};

HelpCard.propTypes = {
  cardContent: PropTypes.shape({
    title: PropTypes.string.isRequired,
    img: PropTypes.shape({}).isRequired,
    text: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    cta: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    newTab: PropTypes.bool.isRequired,
    gaTag: PropTypes.shape({}),
    fbTag: PropTypes.shape({}),
  }).isRequired,
  keyMap: PropTypes.string.isRequired,
};
