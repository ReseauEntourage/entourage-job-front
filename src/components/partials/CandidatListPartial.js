import React, { useContext } from 'react';
import CountUp from 'react-countup';
import { Grid, Section } from 'src/components/utils';
import CVList from 'src/components/cv/CVList';
import Button from 'src/components/utils/Button';
import {
  CANDIDATE_GENDERS_FILTERS,
  CV_FILTERS_DATA,
  INITIAL_NB_OF_CV_TO_DISPLAY,
} from 'src/constants';
import { SharesCountContext } from 'src/store/SharesCountProvider';
import { IconNoSSR } from 'src/components/utils/Icon';

const CandidatListPartial = () => {
  const { totalShares } = useContext(SharesCountContext);

  const counter =
    totalShares > 0 ? (
      <CountUp
        duration={5}
        delay={2}
        end={totalShares}
        preserveValue
        formattingFn={(number) => {
          let stringNumber = number.toString();
          if (stringNumber.length > 4) {
            stringNumber = `${stringNumber.slice(
              0,
              -3
            )}\xa0${stringNumber.slice(-3)}`;
          }
          if (stringNumber.length > 7) {
            stringNumber = `${stringNumber.slice(
              0,
              -7
            )}\xa0${stringNumber.slice(-7)}`;
          }
          if (stringNumber.length > 10) {
            stringNumber = `${stringNumber.slice(
              0,
              -11
            )}\xa0${stringNumber.slice(-11)}`;
          }
          return stringNumber;
        }}
      />
    ) : (
      0
    );

  return (
    <Section style="muted" id="candidat">
      <Grid column middle eachWidths={['2-3@m', '1-1']}>
        <div className="uk-text-center">
          {process.env.WOMENS_DAY === 'true' ? (
            <>
              <h1 className="uk-text-bold uk-margin-remove-bottom">
                Elles sont <span className="uk-text-primary">motivées</span>{' '}
                pour travailler
              </h1>
              <h3 className="uk-text-bold uk-margin-remove-top">
                Votre partage peut tout{' '}
                <span className="uk-text-primary">changer</span>
              </h3>
              <p className="uk-margin-remove-bottom">
                Si vous pensez comme nous que chacune doit avoir sa place dans
                la société et en entreprise, partagez votre réseau professionnel
                avec celles qui en ont le plus besoin.
              </p>
            </>
          ) : (
            <>
              <h1 className="uk-text-bold uk-margin-remove-bottom">
                Ils sont <span className="uk-text-primary">motivés</span> pour
                travailler
              </h1>
              <h3 className="uk-text-bold uk-margin-remove-top">
                Votre partage peut tout{' '}
                <span className="uk-text-primary">changer</span>
              </h3>
              <p className="uk-margin-remove-bottom">
                Si vous pensez comme nous que chacun doit avoir sa place dans la
                société et en entreprise, partagez votre réseau professionnel
                avec ceux qui en ont le plus besoin.
              </p>
            </>
          )}
          <h4 className="uk-text-bold">
            Grâce à vos partages, les CV ont été rendus visibles
            <br className="uk-visible@m" />
            &nbsp;plus de&nbsp;
            <div
              className="uk-hidden@m uk-text-primary uk-text-normal uk-flex uk-flex-center uk-flex-middle"
              style={{ fontSize: 38, fontWeight: 500 }}
            >
              {counter}
            </div>
            <span
              className="uk-text-primary uk-text-normal uk-visible@m"
              style={{ fontSize: 38, fontWeight: 500 }}
            >
              {counter}
            </span>
            &nbsp;fois&nbsp;!
          </h4>
          {process.env.WOMENS_DAY === 'true' && (
            <h3 className="uk-text-bold">
              À l&apos;occasion du 8 mars,{' '}
              <span className="uk-text-italic uk-text-primary">
                Journée internationale des droits des femmes
              </span>
              , on a décidé de mettre à l&apos;honneur les candidates
              LinkedOut&nbsp;!
            </h3>
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
            style="secondary"
          >
            {process.env.WOMENS_DAY === 'true'
              ? 'Voir toutes les candidates'
              : 'Voir tous les candidats'}{' '}
            <IconNoSSR name="chevron-right" />
          </Button>
        </Grid>
      </Grid>
    </Section>
  );
};
export default CandidatListPartial;
