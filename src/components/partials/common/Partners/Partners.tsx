import React from 'react';
import { Button, Img, Section } from 'src/components/utils';
import { H3 } from 'src/components/utils/Headings';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { StyledPartners } from './Partners.styles';

export interface PartnersListItem {
  name: string;
  logo: string;
  width: number;
  height: number;
}

export interface PartnersProps {
  title: string;
  tag?: (typeof GA_TAGS)[keyof typeof GA_TAGS];
  list: PartnersListItem[];
  displayCta: boolean;
}

export const Partners = ({
  title,
  tag,
  list,
  displayCta = true,
}: PartnersProps) => {
  return (
    <StyledPartners>
      <Section className="custom-primary" display="flex-center">
        <H3 title={title} />
        <div className="logos-container">
          {list.map((partner) => {
            return (
              <div key={partner.name}>
                <Img
                  width={partner.width}
                  height={partner.height}
                  src={partner.logo}
                  alt={partner.name}
                />
              </div>
            );
          })}
        </div>
        {displayCta && (
          <Button
            variant="primary"
            rounded
            href="https://www.entourage.social/qui-sommes-nous/partenaires"
            onClick={() => {
              if (tag) gaEvent(tag);
            }}
            newTab
            isExternal
          >
            Voir tous les partenaires
          </Button>
        )}
      </Section>
    </StyledPartners>
  );
};
