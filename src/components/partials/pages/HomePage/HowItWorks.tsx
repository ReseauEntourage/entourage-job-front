import React from 'react';
import { MultipleCTA } from 'src/components/partials/utils/MultipleCTA';
import { Section } from 'src/components/utils';
import { UIKIT_STYLES } from 'src/components/variables';

export const HowItWorks = ({ style }: { style?: UIKIT_STYLES }) => {
  const content = [
    {
      img: '/static/img/illustrations/how1.png',
      text: (
        <div>
          La plateforme <span className="uk-text-primary">Entourage Pro</span>{' '}
          permet de{' '}
          <span className="uk-text-bold">viraliser les CV des candidats</span>{' '}
          sur les réseaux sociaux pour générer des opportunités d’emploi
        </div>
      ),
    },
    {
      img: '/static/img/illustrations/how2.png',
      text: (
        <div>
          Chaque candidat{' '}
          <span className="uk-text-bold">
            est soutenu par un bénévole-coach
          </span>
          , de la recherche d’emploi à l’intégration en entreprise
        </div>
      ),
    },
    {
      img: '/static/img/illustrations/how3.png',
      text: (
        <div>
          <span className="uk-text-bold">Des formations courtes</span>{' '}
          permettent aux candidats qui le souhaitent d’acquérir les compétences
          manquantes et de reprendre confiance
        </div>
      ),
    },
    {
      img: '/static/img/illustrations/how4.png',
      text: (
        <div>
          La <span className="uk-text-bold">communauté Entourage</span> permet
          aux candidats de se ressourcer et de faire de nouvelles rencontres
        </div>
      ),
    },
  ];

  return (
    <Section id="howItWorks" style={style}>
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
        Comment fonctionne{' '}
        <span className="uk-text-primary">Entourage Pro&nbsp;</span>?
      </h2>
      <MultipleCTA data={content} animate />
    </Section>
  );
};

HowItWorks.defaultProps = { style: 'muted' };
