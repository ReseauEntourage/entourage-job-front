import React from 'react';
import { Button, Text } from '@/src/components/utils';
import { CheckListElement, List } from '@/src/components/utils/Lists';
import { FB_TAGS, GA_TAGS } from '@/src/constants/tags';
import { fbEvent } from '@/src/lib/fb';
import { gaEvent } from '@/src/lib/gtag';
import { SimpleImageText } from '../../../utils/SimpleImageText';

export const EntreprisesWebinaire = () => {
  return (
    <SimpleImageText
      img="/static/img/company_why.jpg"
      title="L'inclusion aussi, ça s'apprend !"
    >
      <List>
        <CheckListElement>
          <Text>
            Profitez d’un webinaire pour vous sensibiliser et vous former au
            recrutement inclusif : réduisez vos biais, gagnez en équité dans vos
            process et développez de nouvelles compétences.
          </Text>
        </CheckListElement>
        <CheckListElement>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </CheckListElement>
        <CheckListElement>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </CheckListElement>
      </List>
      <Button
        onClick={() => {
          gaEvent(GA_TAGS.PAGE_ENTREPRISE_WEBINAIRE_CLIC);
          fbEvent(FB_TAGS.COMPANY_WEBINAIRE_OPEN);
        }}
        href=""
        dataTestId="button-company-first-section"
        variant="secondary"
        rounded
      >
        S&apos;inscrire au webinaire
      </Button>
    </SimpleImageText>
  );
};
