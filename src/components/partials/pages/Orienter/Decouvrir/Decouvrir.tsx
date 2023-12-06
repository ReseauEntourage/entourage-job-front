import React from 'react';
import { Button, Img, Section } from 'src/components/utils';
import { H2, H5 } from 'src/components/utils/Headings';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledDecouvrirCard,
  StyledDecouvrirContainer,
} from './Decouvrir.styles';

export const Decouvrir = ({
  handleClick,
}: {
  handleClick: (i: number) => void;
}) => {
  const isDesktop = useIsDesktop();

  return (
    <Section>
      <H2
        title="Booster la recherche d'emploi des personnes que vous accompagnez"
        color="black"
        center
      />
      <StyledDecouvrirContainer data-uk-scrollspy="cls:uk-animation-slide-bottom-small; target: .decouvrir-card; delay: 200">
        <StyledDecouvrirCard
          className={`${isDesktop ? '' : 'mobile'} decouvrir-card`}
        >
          <div className="image-container">
            <Img src="/static/img/orientation_who.jpg" alt="" cover />
          </div>
          <div className="text-container">
            <H5
              title="Parcours tremplin de 6 mois et publication du CV"
              color="primaryOrange"
            />
            <p>
              La personne que vous accompagnez est intéressée par notre
              programme d’accompagnement de 6 mois pour retrouver un emploi.
            </p>
            <Button
              style="custom-secondary-inverted"
              onClick={() => {
                handleClick(1);
              }}
            >
              Découvrir
            </Button>
          </div>
        </StyledDecouvrirCard>
        <StyledDecouvrirCard
          className={`${isDesktop ? '' : 'mobile'} decouvrir-card`}
        >
          <div className="image-container">
            <Img src="/static/img/orienter-decouvrir-2.png" alt="" cover />
          </div>
          <div className="text-container">
            <H5
              title="Parcours tremplin de 6 mois et publication du CV"
              color="primaryOrange"
            />
            <p>
              La personne que vous accompagnez est intéressée par notre
              programme d’accompagnement de 6 mois pour retrouver un emploi.
            </p>
            <Button
              style="custom-secondary-inverted"
              onClick={() => {
                handleClick(2);
              }}
            >
              Découvrir
            </Button>
          </div>
        </StyledDecouvrirCard>
      </StyledDecouvrirContainer>
    </Section>
  );
};
