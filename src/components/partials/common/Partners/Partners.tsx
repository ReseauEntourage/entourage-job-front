import React from 'react';
import { Button, Img, Section } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { StyledPartners } from './Partners.styles';

export const Partners = ({
  tag,
}: {
  tag?: (typeof GA_TAGS)[keyof typeof GA_TAGS];
}) => {
  return (
    <StyledPartners>
      <Section className="custom-primary" display="flex-center">
        <H2
          variant="big"
          title="Ils travaillent avec Entourage Pro"
          weight="normal"
          color={COLORS.darkGrayFont}
        />
        <div className="logos-container">
          <div>
            <Img
              width={150}
              height={70}
              src="/static/img/partners/advens/logo.png"
              alt="advens"
            />
          </div>
          <div>
            <Img
              width={200}
              height={70}
              src="/static/img/partners/archipel/logo.png"
              alt="archipel"
            />
          </div>
          <div>
            <Img
              width={150}
              height={70}
              src="/static/img/partners/ares/logo.png"
              alt="ares"
            />
          </div>
          <div>
            <Img
              width={150}
              height={70}
              src="/static/img/partners/randstad/logo.png"
              alt="randstad"
            />
          </div>
          <div>
            <Img
              width={150}
              height={70}
              src="/static/img/partners/tbwa/logo.png"
              alt="tbwa"
            />
          </div>
        </div>
        <Button
          style="custom-secondary-inverted"
          href="https://www.entourage.social/qui-sommes-nous/partenaires"
          onClick={() => {
            if (tag) gaEvent(tag);
          }}
          newTab
          isExternal
        >
          Voir tous les partenaires
        </Button>
      </Section>
    </StyledPartners>
  );
};
