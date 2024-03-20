import React, { Ref } from 'react';
import { IlluCalendrier, OrienterSablier } from 'assets/icons/icons';
import CarteSolidaireIcon from 'assets/icons/orienter-carte-solidaire.svg';
import { SimpleImageText } from 'src/components/partials/utils/SimpleImageText';
import { Button } from 'src/components/utils';
import { List } from 'src/components/utils/Lists';
import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import { StyledAiderProgrammesListElement } from './AiderProgrammes.styles';

export const AiderProgrammeCoupDePouce = ({
  innerRef,
}: {
  innerRef?: Ref<HTMLDivElement>;
}) => {
  const isDesktop = useIsDesktop();
  const iconsProps = {
    color: COLORS.primaryOrange,
    width: 35,
    height: 35,
  };
  return (
    <>
      <SimpleImageText
        backgroundColor="blue"
        innerRef={innerRef}
        title="Programme Coup de pouce"
        img="/static/img/orientation_who.jpg"
      >
        <List animated>
          <StyledAiderProgrammesListElement
            className={isDesktop ? '' : 'mobile'}
          >
            <IlluCalendrier {...iconsProps} /> <div>Ponctuel</div>
          </StyledAiderProgrammesListElement>
          <StyledAiderProgrammesListElement
            className={isDesktop ? '' : 'mobile'}
          >
            <OrienterSablier {...iconsProps} /> <div>Selon vos besoins</div>
          </StyledAiderProgrammesListElement>
          <StyledAiderProgrammesListElement
            className={isDesktop ? '' : 'mobile'}
          >
            <CarteSolidaireIcon {...iconsProps} />{' '}
            <div>En physique ou en visio</div>
          </StyledAiderProgrammesListElement>
        </List>
        <div data-uk-scrollspy="cls:uk-animation-slide-bottom; target: > p; delay: 200;">
          <p>L’intégration du candidat au parcours Entourage pro comprend :</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Odio
            morbi quis commodo odio aenean sed adipiscing diam donec. Lacinia
            quis vel eros donec ac odio. Commodo nulla facilisi nullam vehicula
            ipsum. Dictum varius duis at consectetur. Duis at tellus at urna
            condimentum mattis pellentesque id nibh
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Odio
            morbi quis commodo odio aenean sed adipiscing diam donec. Lacinia
            quis vel eros donec ac odio. Commodo nulla facilisi nullam vehicula
            ipsum. Dictum varius duis at consectetur. Duis at tellus at urna
            condimentum mattis pellentesque id nibh
          </p>
        </div>
        <Button
          style="custom-secondary-inverted"
          onClick={() => {
            gaEvent(
              GA_TAGS.PAGE_AIDER_PROGRAMME_COUP_DE_POUCE_INSCRIPTION_CLICK
            );
          }}
          dataTestId="button-inscrire-coup-de-pouce"
          href="/inscription"
        >
          S&lsquo;inscrire au programme
        </Button>
      </SimpleImageText>
    </>
  );
};
