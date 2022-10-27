import React from 'react';
import Image from 'next/image';
import Button from 'src/components/utils/Button';
import { IconNoSSR } from 'src/components/utils/Icon';
import { gaEvent } from 'src/lib/gtag';
import { PropTypes } from 'prop-types';
import Link from 'next/link';
import { StyledHelpCard, StyledLink } from './styles';

const HelpCard = ({ cardContent, keyMap }) => {
  const { title, img, text, cta, href, alt, newTab, tag } = cardContent;
  const card = (
    <div className="card-content">
      <div>
        <h4>{title}</h4>
        <Image src={img} objectFit="cover" objectPosition="center" alt={alt} />
        <p>{text}</p>
      </div>
      <Button
        href={href}
        style="primary"
        newTab={newTab}
        isExternal={newTab}
        onClick={() => {
          gaEvent(tag);
        }}
      >
        {cta}&nbsp;
        <IconNoSSR name="chevron-right" />
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
            gaEvent(tag);
          }}
        >
          {card}
        </StyledLink>
      ) : (
        <Link href={href} passHref legacyBehavior>
          <StyledLink
            onClick={() => {
              gaEvent(tag);
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
    tag: PropTypes.string.isRequired,
  }).isRequired,
  keyMap: PropTypes.string.isRequired,
};

export default HelpCard;
