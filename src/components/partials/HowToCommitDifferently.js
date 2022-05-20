import React from 'react';
import { Section } from 'src/components/utils';
import { EXTERNAL_LINKS } from 'src/constants';
import MultipleCTA from 'src/components/partials/MultipleCTA';
import { GA_TAGS } from 'src/constants/tags';

const HowToCommitDifferently = () => {
  return (
    <Section container="large" id="sengager" style="muted">
      <h2 className="uk-text-center uk-text-bold">
        <span className="uk-text-primary">Nous soutenir</span> autrement
      </h2>
      <MultipleCTA
        spacing="large"
        className="uk-margin-medium-top"
        data={[
          {
            title: 'Faire un don',
            text: "Aidez-nous à développer le programme LinkedOut et à accompagner les candidats via un don déductible de vos impôts ou un dispositif d'arrondi solidaire.",
            button: {
              label: 'Faire un don',
              href: EXTERNAL_LINKS.DONATION,
              external: true,
            },
            tag: GA_TAGS.PAGE_ENTREPRISES_DONS_CLIC,
          },
          {
            title:
              "Sensibiliser mes collaborateurs à l'inclusion professionnelle",
            text: 'Défi solidaire ou atelier de sensibilisation, engagez vos collaborateurs, RH et managers grâce à des formats modulables.',
            button: {
              label: 'Sensibiliser mon équipe',
              href: '/entreprises/sinformer',
            },
            tag: GA_TAGS.PAGE_ENTREPRISES_SENSIBILISER_CLIC,
          },
          {
            title: 'Partager votre expertise',
            text: 'Vous pouvez nous accompagner via du mécénat de compétences ou des dons en nature (équipement informatique, etc.)',
            button: {
              label: 'Proposer du mécénat',
              href: '/entreprises/sinformer',
            },
            tag: GA_TAGS.PAGE_ENTREPRISES_MECENAT_CLIC,
          },
        ]}
      />
    </Section>
  );
};

export default HowToCommitDifferently;
