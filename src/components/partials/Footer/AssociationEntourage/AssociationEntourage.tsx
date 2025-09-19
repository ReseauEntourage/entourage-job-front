import React from 'react';
import EntourageLogo from 'assets/icons/logo-entourage.svg';
import {
  Background,
  Button,
  Grid,
  LegacyImg,
  Section,
  Text,
} from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { EXTERNAL_LINKS } from 'src/constants';
import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import {
  StyledAssociationEntourageImageContainer,
  StyledAssociationEntourageButtonContainer,
} from './AsociationEntourage.styles';

export const AssociationEntourage = () => {
  return (
    <Background blend={{ colorHex: COLORS.black }}>
      <Section>
        <div className="uk-text-center">
          <Grid
            middle
            center
            childWidths={['1-2@m']}
            className="uk-margin-large-top"
          >
            <div>
              <EntourageLogo width={50} height={50} />
              <H2 center color="white" title="A propos d'Entourage" />
              <div className="uk-light">
                <Text center color="white">
                  Depuis 2014, l&apos;association Entourage lutte contre la
                  précarité et l&apos;exclusion en redonnant des réseaux de
                  soutien à celles et ceux qui n&apos;en ont plus.
                </Text>
                <StyledAssociationEntourageButtonContainer>
                  <Button
                    href={EXTERNAL_LINKS.ENTOURAGE}
                    variant="secondary"
                    rounded
                    isExternal
                    onClick={() => {
                      gaEvent(GA_TAGS.FOOTER_SITE_ENTOURAGE_CLIC);
                    }}
                    newTab
                  >
                    Voir le site
                  </Button>
                </StyledAssociationEntourageButtonContainer>
              </div>
            </div>
            <StyledAssociationEntourageImageContainer>
              <LegacyImg
                cover
                src="/static/img/association_pic.jpg"
                alt="Association Entourage"
              />
            </StyledAssociationEntourageImageContainer>
          </Grid>
        </div>
      </Section>
    </Background>
  );
};
