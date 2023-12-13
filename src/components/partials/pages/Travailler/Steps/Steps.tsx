import React from 'react';
import { Section, Button } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { StyledSteps } from './Steps.styles';

export const Steps = ({ cta }: { cta: (label: string) => void }) => {
  return (
    <Section className="custom-primary" display="flex-center">
      <H2 title="Les grandes étapes du programme" />
      <StyledSteps>
        <div className="cell">
          <div
            className="strong"
            data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;"
          >
            Nous nous rencontrons dans nos locaux
          </div>
          <div data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;">
            Vous vous inscrivez à une réunion pour en apprendre plus sur notre
            programmme et valider votre envie d’y participer
          </div>
        </div>
        <div className="cell empty" />
        <div className="cell empty" />
        <div className="cell">
          <div
            className="strong"
            data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;"
          >
            Nous validons votre participation en échange individuel
          </div>
          <div data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;">
            Après avoir participé à la reunion d’information, nous prenons un
            RDV pour approfondir vos besoins et confirmer ensemble votre
            participation au programme.
          </div>
        </div>
        <div className="cell">
          <div
            className="strong"
            data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;"
          >
            Nous trouvons un coach bénévole pour vous accompagner
          </div>
          <div data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;">
            Nous programmons la première rencontre avec votre coach. Celle-ci se
            fait dans les locaux de votre ville, selon vos disponibilités.
          </div>
        </div>
        <div className="cell empty" />
        <div className="cell empty" />
        <div className="cell">
          <div
            className="strong"
            data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;"
          >
            Le parcours commence !!
          </div>
          <div data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;">
            Nous vous accompagnons pendant 6 mois, à chaque étape de votre
            recherche d’emploi.
          </div>
        </div>
      </StyledSteps>
      <Button
        onClick={() => {
          cta('P3_Etapes');
        }}
        style="custom-secondary-inverted"
      >
        S&apos;inscrire
      </Button>
    </Section>
  );
};
