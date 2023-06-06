import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Section } from 'src/components/utils';
import { CandidatCard } from 'src/components/cards';
import { Api } from 'src/api/index.ts';
import { Button } from 'src/components/utils/Button';
import { IconNoSSR } from 'src/components/utils/Icon.tsx';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';

const DiscoverPartial = ({ style }) => {
  const [cvs, setCVs] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    Api.getCVRandom({ nb: 3 })
      .then(({ data }) => {
        return setCVs(data.cvs);
      })
      .catch((err) => {
        console.error(err);
        setError('Impossible de récupérer les CVs.');
      });
  }, []);

  const Content = () => {
    if (error) return <p className="uk-text-italic">{error}</p>;
    if (cvs === undefined) return <LoadingScreen />;
    return (
      <Grid
        childWidths={['1-3@m']}
        gap="small"
        items={cvs.map((cv) => {
          return (
            <CandidatCard
              businessLines={cv.businessLines}
              url={cv.user && cv.user.url}
              imgSrc={
                (cv.urlImg && process.env.AWSS3_CDN_URL + cv.urlImg) ||
                undefined
              }
              imgAlt={cv.user && cv.user.candidat.firstName}
              firstName={cv.user && cv.user.candidat.firstName}
              gender={cv.user && cv.user.candidat.gender}
              ambitions={cv.ambitions}
              skills={cv.skills}
              catchphrase={cv.catchphrase}
              employed={cv.user.employed}
              endOfContract={cv.user.endOfContract}
              id={cv.user.candidat.id}
              locations={cv.locations}
            />
          );
        })}
      />
    );
  };
  return (
    <Section id="discover" style={style}>
      <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
        Découvrez les <span className="uk-text-primary">candidats</span>
      </h2>
      <Content />
      <div className="uk-flex uk-flex-center">
        <Button
          style="primary"
          href={{ pathname: '/candidats', query: { employed: false } }}
          className="uk-margin-large-top"
        >
          Voir tous les candidats <IconNoSSR name="chevron-right" />
        </Button>
      </div>
    </Section>
  );
};

DiscoverPartial.propTypes = {
  style: PropTypes.string,
};

DiscoverPartial.defaultProps = {
  style: 'default',
};

export default DiscoverPartial;
