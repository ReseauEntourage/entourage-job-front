import React from 'react';
import { v4 as uuidV4 } from 'uuid';
import {
  Section,
  Grid,
  ContainerWithTextCentered,
  Typography,
} from 'src/components/utils';
import { ContainerMarginY } from 'src/components/utils/Containers/ContainerMarginY';
import { H2, H4 } from 'src/components/utils/Headings';
import { StyledHowToBeInclusiveTitleContainer } from './Sinformer.styles';

const tips = [
  {
    title: (
      <>
        Recruter
        <br />
        inclusif
      </>
    ),
    text: (
      <p>
        Osez donner sa chance à une personne en précarité pour lui permettre de
        trouver sa place dans votre entreprise et dans la société.
      </p>
    ),
  },
  {
    title: (
      <>
        Acheter
        <br />
        inclusif
      </>
    ),
    text: (
      <p>
        En achetant des services à des structures d’insertion ou à des ESAT,
        vous créez de l’activité économique pour des personnes vulnérables.
      </p>
    ),
  },
  {
    title: 'Soutenir des associations',
    text: (
      <p>
        Par du mécénat financier, de moyens ou de compétences, soutenez des
        projets comme Entourage Pro ou d&apos;autres qui accompagnent des
        personnes fragiles.
      </p>
    ),
  },
  {
    title: 'Engager ses collaborateurs',
    text: (
      <p>
        Par la sensibilisation de vos salariés à la question de la fragilité,
        vous contribuez à diffuser une culture de l’inclusion dans le monde du
        travail.
      </p>
    ),
  },
];

export const HowToBeInclusive = () => {
  return (
    <Section className="custom-blue-bg">
      <ContainerMarginY>
        <H2
          title={<>Concrètement,&nbsp;comment être inclusif ?</>}
          center
          color="black"
        />
        <ContainerWithTextCentered>
          <p>
            Il y a 1001 manières de s’engager dans l’inclusion. La plus
            impactante est bien sûr de vous engager en tant qu’employeur, en
            donnant accès à l’emploi à des personnes qui en sont éloignées. Mais
            vous pouvez aussi agir autrement. Les différents leviers d’actions
            sont les suivants :{' '}
          </p>
        </ContainerWithTextCentered>
        <div>
          <Grid
            childWidths={[`1-${tips.length}@m`]}
            match
            className="uk-margin-top"
            gap="large"
            items={tips.map((item) => {
              return (
                <div key={uuidV4()}>
                  <StyledHowToBeInclusiveTitleContainer>
                    <H4 title={item.title} />
                  </StyledHowToBeInclusiveTitleContainer>
                  {item.text && <Typography>{item.text}</Typography>}
                </div>
              );
            })}
          />
        </div>
      </ContainerMarginY>
    </Section>
  );
};
