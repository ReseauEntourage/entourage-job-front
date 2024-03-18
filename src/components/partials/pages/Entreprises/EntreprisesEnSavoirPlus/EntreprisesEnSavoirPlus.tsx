import React from 'react';
import { openModal } from 'src/components/modals/Modal';
import { CompanyContactModal } from 'src/components/modals/Modal/ModalGeneric/CompanyContactModal';
import {
  Button,
  Section,
  StyledCenteredButtonContainer,
} from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { FB_TAGS, GA_TAGS, LINK_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { linkEvent } from 'src/lib/lintrk';

export const EntreprisesEnSavoirPlus = () => {
  return (
    <Section style="primary">
      <H2
        title="Envie d'en savoir plus sur le recrutement inclusif avec Entourage Pro ?"
        center
        color="white"
      />
      <StyledCenteredButtonContainer>
        <Button
          dataTestId="button-contact-company-last-section"
          onClick={() => {
            gaEvent(GA_TAGS.PAGE_ENTREPRISES_CONTACTER_REFERENT_CLIC);
            fbEvent(FB_TAGS.COMPANY_CONTACT_OPEN);
            linkEvent(LINK_TAGS.COMPANY_CONTACT_OPEN);
            openModal(<CompanyContactModal />);
          }}
          style="custom-secondary"
          className="uk-margin-small-top"
        >
          Nous contacter
        </Button>
      </StyledCenteredButtonContainer>
    </Section>
  );
};
