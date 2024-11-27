import React from 'react';
import { CVList } from 'src/components/partials/CV/CVList';
import { Grid, Section, Button, Text } from 'src/components/utils';
import { H2, H4 } from 'src/components/utils/Headings';
import { CV_FILTERS_DATA, INITIAL_NB_OF_CV_TO_DISPLAY } from 'src/constants';

export const CandidatListPartial = () => {
  return (
    <Section id="candidat">
      <Grid column middle eachWidths={['2-3@m', '1-1']}>
        <div className="uk-text-center">
          {process.env.WOMENS_DAY === 'true' ? (
            <>
              <H2
                title="Elles sont motivées pour travailler"
                center
                color="black"
              />
              <Text size="large" center>
                Découvrez les derniers CV des nos candidates et partagez-les
                pour leur donner la visibilité qu&lsquo;elles méritent !
              </Text>
            </>
          ) : (
            <>
              <H2
                title="Ils sont motivés pour travailler"
                center
                color="black"
              />
              <Text size="large" center>
                Découvrez les derniers CV des nos candidat(e)s et partagez-les
                pour leur donner la visibilité qu&lsquo;ils méritent !
              </Text>
            </>
          )}
          {process.env.WOMENS_DAY === 'true' && (
            <H4
              title={
                <>
                  À l&apos;occasion du 8 mars,{' '}
                  <span className="uk-text-italic uk-text-primary">
                    Journée internationale des droits des femmes
                  </span>
                  , on a décidé de mettre à l&apos;honneur les candidates
                  Entourage Pro&nbsp;!
                </>
              }
              center
            />
          )}
        </div>
        <CVList
          hideSearchBar
          nb={INITIAL_NB_OF_CV_TO_DISPLAY}
          filters={
            process.env.WOMENS_DAY === 'true'
              ? {
                  [CV_FILTERS_DATA[3].key]: [CV_FILTERS_DATA[3].constants[1]],
                }
              : {}
          }
        />
        <Grid middle column gap="collapse">
          <Button
            href={{ pathname: '/candidats', query: { employed: false } }}
            style="custom-secondary-inverted"
          >
            {process.env.WOMENS_DAY === 'true'
              ? 'Découvrir les candidates'
              : 'Découvrir les candidats'}
          </Button>
        </Grid>
      </Grid>
    </Section>
  );
};
