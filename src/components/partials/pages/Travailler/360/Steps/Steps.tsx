import React from 'react';
import { FlexContainer } from '../../Programmes/TravaillerProgrammes.styles';
import { Section, Button } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { StyledSteps } from './Steps.styles';

export const Steps = () => {
  return (
    <Section className="custom-primary" display="flex-center">
      <H2 title="Les grandes étapes du format 360" />
      <StyledSteps>
        <div className="cell">
          <div className="strong">Nous nous rencontrons dans nos locaux</div>
          <div>
            Vous vous inscrivez à une réunion pour en apprendre plus sur notre
            programmme et valider votre envie d’y participer
          </div>
        </div>
        <div className="cell empty" />
        <div className="cell empty" />
        <div className="cell">
          <div className="strong">
            Nous validons votre participation en échange individuel
          </div>
          <div>
            Après avoir participé à la reunion d’information, nous prenons un
            RDV pour approfondir vos besoins et confirmer ensemble votre
            participation au format 360.
          </div>
        </div>
        <div className="cell">
          <div className="strong">
            Nous trouvons un coach bénévole pour vous accompagner
          </div>
          <div>
            Nous programmons la première rencontre avec votre coach. Celle-ci se
            fait dans les locaux de votre ville, selon vos disponibilités.
          </div>
        </div>
        <div className="cell empty" />
        <div className="cell empty" />
        <div className="cell">
          <div className="strong">Le parcours commence !!</div>
          <div>
            Nous vous accompagnons pendant 6 mois, à chaque étape de votre
            recherche d’emploi.
          </div>
        </div>
      </StyledSteps>
      <FlexContainer>
        <Button href="/inscription" style="custom-secondary-inverted">
          S&apos;inscrire au format 360
        </Button>
        {/* Todo: gaEvent and url tbd */}
        <Button
          style="custom-secondary"
          dataTestId="button-orienter-candidat"
          href="/inscription"
        >
          Orienter un candidat
        </Button>
      </FlexContainer>
    </Section>
  );
};
