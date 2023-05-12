import Image from 'next/image';
import React from 'react';
import CarrefourLogo from 'public/static/img/partners/carrefour/logo.png';
import DecathlonLogo from 'public/static/img/partners/decathlon/logo.png';
import JCDecauxLogo from 'public/static/img/partners/jcdecaux/logo.png';
import LeRoyMerlinLogo from 'public/static/img/partners/leroymerlin/logo.png';
import ManoManoLogo from 'public/static/img/partners/manomano/logo.png';
import MurfyLogo from 'public/static/img/partners/murfy/logo.png';
import { Button, Section } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { StyledPartners } from './Partners.styles';

/* const partnersToShow = [
  'leroymerlin',
  'manomano',
  'murfy',
  'carrefour',
  'decathlon',
  'jcdecaux',
]; */

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
            <Image
              src={LeRoyMerlinLogo}
              objectFit="contain"
              objectPosition="center"
              alt="leroymerlin"
            />
          </div>
          <div>
            <Image
              src={ManoManoLogo}
              objectFit="contain"
              objectPosition="center"
              alt="manomano"
            />
          </div>
          <div>
            <Image src={MurfyLogo} objectFit="cover" objectPosition="center" />
          </div>
          <div>
            <Image
              src={CarrefourLogo}
              objectFit="contain"
              objectPosition="center"
              alt="carrefour"
            />
          </div>
          <div>
            <Image
              src={DecathlonLogo}
              objectFit="contain"
              objectPosition="center"
              alt="decathlon"
            />
          </div>
          <div>
            <Image
              src={JCDecauxLogo}
              objectFit="contain"
              objectPosition="center"
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
