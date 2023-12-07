import Link from 'next/link';
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

interface HelpCardProps {
  cardContent: {
    title: string;
    img: string;
    text: string;
    cta: string;
    href: string;
    alt: string;
    newTab: boolean;
    gaTag: { action: string };
    fbTag?: {
      action: string;
      options: {
        content_category: string;
      };
    };
  };
  keyMap: string;
}

export const HelpCard = ({ cardContent, keyMap }: HelpCardProps) => {
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
