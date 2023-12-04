import React from 'react';
import { Background, Grid, Section } from 'src/components/utils';

export const LandingPagePartial = () => {
  return (
    <Background
      blend={{ mode: 'soft-light', colorHex: 'rgba(0,0,0,0.4)' }}
      src="/static/img/cover-linkedout.jpg"
      position="top-center"
    >
      <div
        className="uk-flex uk-flex-1 uk-flex-center"
        data-uk-height-viewport="offset-bottom: 40"
      >
        <div
          style={{
            display: 'inline-block',
            margin: 'auto',
            paddingBottom: '30px',
          }}
        >
          <Section container="large" className="uk-padding">
            <Grid middle column gap="medium">
              <h1
                className="uk-text-bold uk-text-center uk-width-xlarge@m"
                style={{ color: 'white' }}
              >
                <span>Partagez votre </span>
                <span className="uk-text-primary">réseau professionnel</span>
                <span>
                  {' '}
                  avec{' '}
                  {process.env.WOMENS_DAY === 'true'
                    ? 'celles'
                    : 'celles et ceux'}{' '}
                  qui n&apos;en ont pas
                </span>
              </h1>
            </Grid>
          </Section>
        </div>
      </div>
    </Background>
  );
};
