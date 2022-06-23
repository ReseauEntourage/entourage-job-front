import React from 'react';
import { Section } from 'src/components/utils';
import { EXTERNAL_LINKS } from 'src/constants';
import MultipleCTA from 'src/components/partials/MultipleCTA';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { fbEvent } from 'src/lib/fb';

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
              href: EXTERNAL_LINKS.DONATION,
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
              href: process.env.AIRTABLE_LINK_COMPANY_SENSITIZATION,
              external: true,
              onClick: () => {
                gaEvent(GA_TAGS.PAGE_ENTREPRISES_SENSIBILISER_CLIC);
                fbEvent(FB_TAGS.COMPANY_CONTACT);
              },
            },
          },
          {
            img: '/static/img/illustrations/network.png',
            title: 'Partager votre expertise',
            text: 'Vous pouvez nous accompagner via du mécénat de compétences ou des dons en nature (équipement informatique, etc.)',
            button: {
              label: 'Proposer du mécénat',
              href: process.env.AIRTABLE_LINK_COMPANY_SPONSOR,
              external: true,
              onClick: () => {
                gaEvent(GA_TAGS.PAGE_ENTREPRISES_MECENAT_CLIC);
                fbEvent(FB_TAGS.COMPANY_CONTACT);
              },
            },
          },
        ]}
      />
    </Section>
  );
};

export default HowToCommitDifferently;
