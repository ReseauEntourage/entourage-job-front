import React from 'react';
import { Button, Text } from '@/src/components/utils';
import { FB_TAGS, GA_TAGS } from '@/src/constants/tags';
import { fbEvent } from '@/src/lib/fb';
import { gaEvent } from '@/src/lib/gtag';
import { SimpleImageText } from '../../../utils/SimpleImageText';
import { StyledEntreprisesWebinaireContainer } from './EntreprisesWebinaire.styles';

export const EntreprisesWebinaire = () => {
  return (
    <SimpleImageText
      img="/static/img/company_webinar.jpg"
      title="L'inclusion aussi, ça s'apprend !"
    >
      <StyledEntreprisesWebinaireContainer>
        <Text>
          Profitez d’un webinaire pour vous sensibiliser et vous former au
          recrutement inclusif : réduisez vos biais, gagnez en équité dans vos
          process et développez de nouvelles compétences.
        </Text>

        <Button
          onClick={() => {
            gaEvent(GA_TAGS.PAGE_ENTREPRISE_WEBINAIRE_CLIC);
            fbEvent(FB_TAGS.COMPANY_WEBINAIRE_OPEN);
          }}
          href={process.env.NEXT_PUBLIC_COMPANY_WEBINAR}
          newTab
          isExternal
          dataTestId="button-company-first-section"
          variant="secondary"
          rounded
        >
          S&apos;inscrire au webinaire
        </Button>
      </StyledEntreprisesWebinaireContainer>
    </SimpleImageText>
  );
};
