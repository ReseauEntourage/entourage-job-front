import React from 'react';
import { Section, Button, Img } from 'src/components/utils';
import { H2, H6 } from 'src/components/utils/Headings';
import { BulletListElement as BulletList } from 'src/components/utils/Lists';
import { StyledRejoindre } from './Rejoindre.styles';

export const Rejoindre = ({ cta }: { cta: (label: string) => void }) => {
  return (
    <Section className="custom-primary">
      <StyledRejoindre>
        <div className="text-container">
          <H2 type="light" title={`Vous avez envie de nous rejoindre\xa0?`} />
          <p>
            LinkedOut s&apos;adresse à des personnes motivées et disponibles
            pour travailler et qui en raison d&apos;un parcours de vie difficile
            peinent à retrouver un emploi.
          </p>
          <p>Pour participer au programme vous devez&nbsp;:</p>
          <ul>
            <BulletList>
              <H6
                title={`Habiter dans les villes / département suivants\xa0:`}
                effect="cls:uk-animation-slide-bottom; delay: 200;"
              />
              <p data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;">
                Paris (75), Hauts-de-Seine (92), Seine-Saint-Denis (93), Lille,
                Lyon, Rennes ou Lorient
              </p>
            </BulletList>
            <BulletList>
              <H6
                title="Avoir le droit de travailler en France"
                effect="cls:uk-animation-slide-bottom; delay: 200;"
              />
              <p data-uk-scrollspy="cls:uk-animation-slide-bottom; delay: 200;">
                (disposer d’une pièce d’identité ou titre de séjour avec une
                autorisation de travail, avoir une domiciliation, un compte
                bancaire et une attestation de Sécurité Sociale)
              </p>
            </BulletList>
          </ul>
          <Button
            style="custom-secondary-inverted"
            onClick={() => {
              cta('P2_Envie_Rejoindre');
            }}
          >
            Finaliser mon inscription
          </Button>
        </div>
        <div className="image-container">
          <Img
            src="/static/img/travailler-rejoindre.jpg"
            cover
            alt="Communauté LinkedOut au départ de la route du rhum"
          />
        </div>
      </StyledRejoindre>
    </Section>
  );
};
