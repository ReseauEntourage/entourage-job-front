import React from 'react';
import { openModal } from 'src/components/modals/Modal';
import { ModalInterestLinkedOut } from 'src/components/modals/Modal/ModalGeneric/StepperModal/ModalInterestLinkedOut';
import { MultipleCTA } from 'src/components/partials/utils/MultipleCTA';
import { Section } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { StyledEnSavoirPlusButtonContainer } from './EnSavoirPlus.styles';

export const EnSavoirPlus = () => {
  return (
    <Section container="large" style="muted">
      <H2
        title={
          <>
            Vous souhaitez <span className="orange">en savoir plus</span> sur
            Entourage Pro&nbsp;?
          </>
        }
        color="black"
        center
      />
      <StyledEnSavoirPlusButtonContainer>
        <MultipleCTA
          data={[
            {
              button: {
                label: 'Nous contacter',
                onClick: () => {
                  gaEvent(GA_TAGS.PAGE_ORIENTER_CONTACT_CLIC);
                  openModal(<ModalInterestLinkedOut />);
                },
                dataTestId: 'button-contact',
              },
            },
            {
              button: {
                label: 'Télécharger la brochure',
                href: process.env.ASSOCIATION_BROCHURE,
                external: true,
                onClick: () => {
                  gaEvent(GA_TAGS.PAGE_ORIENTER_BROCHURE_CLIC);
                },
                style: 'custom-primary-inverted',
              },
            },
          ]}
        />
      </StyledEnSavoirPlusButtonContainer>
    </Section>
  );
};
