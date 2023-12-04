import React from 'react';
import { Button, Img, Section } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { StyledPartners } from './Partners.styles';

export const Partners = () => {
  return (
    <StyledPartners>
      <Section className="custom-primary" display="flex-center">
        <H2 type="big" title="Elles ont déjà recruté" />
        {/* <LogoList
          logos={PARTNERS.HIRED.filter(({ key }) => {
            return partnersToShow.includes(key);
          })}
        /> */}
        <div className="logos-container">
          <div>
            <Img
              width={150}
              height={70}
              src="/static/img/partners/leroymerlin/logo.png"
              alt="leroymerlin"
            />
          </div>
          <div>
            <Img
              width={200}
              height={70}
              src="/static/img/partners/manomano/logo.png"
              alt="manomano"
            />
          </div>
          <div>
            <Img
              width={150}
              height={70}
              src="/static/img/partners/murfy/logo.png"
              alt="murfy"
            />
          </div>
          <div>
            <Img
              width={150}
              height={70}
              src="/static/img/partners/carrefour/logo.png"
              alt="carrefour"
            />
          </div>
          <div>
            <Img
              width={200}
              height={70}
              src="/static/img/partners/decathlon/logo.png"
              alt="decathlon"
            />
          </div>
          <div>
            <Img
              width={150}
              height={70}
              src="/static/img/partners/jcdecaux/logo.png"
              alt="jcdecaux"
            />
          </div>
        </div>
        <Button style="custom-secondary-inverted" href="/partenaires">
          Voir tous les partenaires
        </Button>
      </Section>
    </StyledPartners>
  );
};
