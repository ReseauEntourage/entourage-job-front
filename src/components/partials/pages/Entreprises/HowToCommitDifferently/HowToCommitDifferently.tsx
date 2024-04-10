import React from 'react';
import { CompanyContactModal } from 'src/components/modals/Modal/ModalGeneric/CompanyContactModal';
import { openModal } from 'src/components/modals/Modal/openModal';
import { MultipleCTA } from 'src/components/partials/utils/MultipleCTA';
import { Section } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { FB_TAGS, GA_TAGS, LINK_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { linkEvent } from 'src/lib/lintrk';

export const HowToCommitDifferently = () => {
  return (
    <Section container="large" style="muted">
      <H2
        title={
          <>
            <span className="uk-text-primary">Nous soutenir</span> autrement
          </>
        }
        center
        color="black"
      />
      <MultipleCTA
        animate
        spacing="large"
        className="uk-margin-medium-top"
        data={[
          {
            img: '/static/img/entreprise-don.png',
            title: 'Faire un don',
            text: "Aidez-nous à développer le programme Entourage Pro et à accompagner les candidats via un don déductible de vos impôts ou un dispositif d'arrondi solidaire.",
            button: {
              label: 'Faire un don',
              href: process.env.DONATION_LINK,
              external: true,
              style: 'custom-secondary-inverted',
              onClick: () => {
                gaEvent(GA_TAGS.PAGE_ENTREPRISES_DON_CLIC);
              },
            },
          },
          {
            img: '/static/img/entreprise-sensibilisation.png',
            title: 'Sensibiliser mes collaborateurs',
            text: 'Défi solidaire ou atelier de sensibilisation, engagez vos collaborateurs, RH et managers grâce à des formats modulables.',
            button: {
              label: 'Sensibiliser mon équipe',
              style: 'custom-secondary-inverted',
              onClick: () => {
                gaEvent(GA_TAGS.PAGE_ENTREPRISES_SENSIBILISER_CLIC);
                fbEvent(FB_TAGS.COMPANY_CONTACT_OPEN);
                linkEvent(LINK_TAGS.COMPANY_CONTACT_OPEN);
                openModal(<CompanyContactModal />);
              },
            },
          },
          {
            img: '/static/img/entreprise-expertise.png',
            title: 'Partager votre expertise',
            text: 'Vous pouvez nous accompagner via du mécénat de compétences ou des dons en nature (équipement informatique, etc.)',
            button: {
              label: 'Proposer du mécénat',
              style: 'custom-secondary-inverted',
              onClick: () => {
                gaEvent(GA_TAGS.PAGE_ENTREPRISES_MECENAT_CLIC);
                fbEvent(FB_TAGS.COMPANY_CONTACT_OPEN);
                linkEvent(LINK_TAGS.COMPANY_CONTACT_OPEN);
                openModal(<CompanyContactModal />);
              },
            },
          },
        ]}
      />
    </Section>
  );
};
