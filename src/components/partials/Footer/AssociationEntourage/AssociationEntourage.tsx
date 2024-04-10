import React from 'react';
import ChevronRightIcon from 'assets/icons/chevron-right.svg';
import EntourageLogo from 'assets/icons/logo-entourage.svg';
import { Background, Button, Grid, Img, Section } from 'src/components/utils';
import { EXTERNAL_LINKS } from 'src/constants';
import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';

export const AssociationEntourage = () => {
  return (
    <Background blend={{ colorHex: COLORS.black }}>
      <Section className="uk-padding-remove-top">
        <div
          style={{ borderTop: 'solid 1px rgba(255, 255, 255, 0.2)' }}
          className="uk-text-center"
        >
          <Grid
            middle
            center
            childWidths={['1-2@m']}
            className="uk-margin-large-top"
          >
            <div>
              <EntourageLogo width={50} height={50} />
              <h2 className="uk-text-bold uk-margin-small">
                <span style={{ color: COLORS.white }}>
                  A propos d&apos;Entourage
                </span>
              </h2>
              <div className="uk-light">
                <p className="uk-text-center uk-padding-small uk-text-secondary">
                  Depuis 2014, l&apos;association Entourage lutte contre la
                  précarité et l&apos;exclusion en redonnant des réseaux de
                  soutien à celles et ceux qui n&apos;en ont plus.
                </p>
                <div className="uk-flex uk-flex-center">
                  <Button
                    href={EXTERNAL_LINKS.ENTOURAGE}
                    style="custom-secondary"
                    isExternal
                    color="white"
                    onClick={() => {
                      gaEvent(GA_TAGS.FOOTER_SITE_ENTOURAGE_CLIC);
                    }}
                    newTab
                  >
                    Voir le site
                    <ChevronRightIcon />
                  </Button>
                </div>
              </div>
            </div>
            <div className="uk-cover-container uk-height-medium">
              <Img
                cover
                src="/static/img/association_pic.jpg"
                alt="Association Entourage"
              />
            </div>
          </Grid>
        </div>
      </Section>
    </Background>
  );
};
