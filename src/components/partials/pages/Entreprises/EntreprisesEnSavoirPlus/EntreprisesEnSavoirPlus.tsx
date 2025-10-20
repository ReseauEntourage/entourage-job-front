import React from 'react';
import { openModal } from 'src/components/modals/Modal';
import { CompanyContactModal } from 'src/components/modals/Modal/ModalGeneric/CompanyContactModal';
import {
  Text,
  Button,
  Section,
  StyledCenteredButtonContainer,
} from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { FB_TAGS, GA_TAGS, LINK_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { linkEvent } from 'src/lib/lintrk';
import { StyledEntreprisesEnSavoirPlusContainer } from './EntreprisesEnSavoirPlus.styles';

export const EntreprisesEnSavoirPlus = () => {
  return (
    <Section style="primary">
      <StyledEntreprisesEnSavoirPlusContainer>
        <H2 title="Une question, une précision ?" center color="white" />
        <Text center color="white" size="large">
          Nos équipes sont à votre disposition
        </Text>
        <StyledCenteredButtonContainer>
          <Button
            dataTestId="button-contact-company-last-section"
            onClick={() => {
              gaEvent(GA_TAGS.PAGE_ENTREPRISES_CONTACTER_REFERENT_CLIC);
              fbEvent(FB_TAGS.COMPANY_CONTACT_OPEN);
              linkEvent(LINK_TAGS.COMPANY_CONTACT_OPEN);
              openModal(<CompanyContactModal />);
            }}
            variant="secondary"
            rounded
            className="uk-margin-small-top"
          >
            Nous contacter
          </Button>
        </StyledCenteredButtonContainer>
      </StyledEntreprisesEnSavoirPlusContainer>
    </Section>
  );
};
