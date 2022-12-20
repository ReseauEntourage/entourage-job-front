import React from 'react';
import { Section } from 'src/components/utils';
import MultipleCTA from 'src/components/partials/MultipleCTA';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import CompanyContactModal from 'src/components/modals/Modal/ModalGeneric/CompanyContactModal';
import { openModal } from 'src/components/modals/Modal/openModal';

const HowToCommitDifferently = () => {
  return (
    <Section container="large" style="muted">
      <h2 className="uk-text-center uk-text-bold uk-margin-medium-bottom">
        <span className="uk-text-primary">Nous soutenir</span> autrement
      </h2>
      <MultipleCTA
        animate
        spacing="large"
        className="uk-margin-medium-top"
        data={[
          {
            img: '/static/img/illustrations/donation.png',
            title: 'Faire un don',
            text: "Aidez-nous à développer le programme LinkedOut et à accompagner les candidats via un don déductible de vos impôts ou un dispositif d'arrondi solidaire.",
            button: {
              label: 'Faire un don',
              href: process.env.DONATION_LINK,
              external: true,
            },
            onClick: () => {
              gaEvent(GA_TAGS.PAGE_ENTREPRISES_DON_CLIC);
            },
          },
          {
            img: '/static/img/illustrations/scale.png',
            title:
              "Sensibiliser mes collaborateurs à l'inclusion professionnelle",
            text: 'Défi solidaire ou atelier de sensibilisation, engagez vos collaborateurs, RH et managers grâce à des formats modulables.',
            button: {
              label: 'Sensibiliser mon équipe',
              onClick: () => {
                gaEvent(GA_TAGS.PAGE_ENTREPRISES_SENSIBILISER_CLIC);
                openModal(<CompanyContactModal />);
              },
            },
          },
          {
            img: '/static/img/illustrations/network.png',
            title: 'Partager votre expertise',
            text: 'Vous pouvez nous accompagner via du mécénat de compétences ou des dons en nature (équipement informatique, etc.)',
            button: {
              label: 'Proposer du mécénat',
              onClick: () => {
                gaEvent(GA_TAGS.PAGE_ENTREPRISES_MECENAT_CLIC);
                openModal(<CompanyContactModal />);
              },
            },
          },
        ]}
      />
    </Section>
  );
};

export default HowToCommitDifferently;
