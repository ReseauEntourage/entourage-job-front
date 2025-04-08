import React, { useEffect, useState } from 'react';
import { Api } from 'src/api';
import { CV } from 'src/api/types';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { CandidatCard } from 'src/components/cards';
import { Grid, Section, Text } from 'src/components/utils';
import { Button } from 'src/components/utils/Button';
import { H2 } from 'src/components/utils/Headings';
import { StyledCVDiscoverButtonContainer } from './CVDiscover.styles';

export const CVDiscover = () => {
  const [cvs, setCVs] = useState<CV[]>();
  const [error, setError] = useState<string | null>(null);

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

  if (cvs === undefined) return <LoadingScreen />;
  return (
    <Section id="discover" className="custom-primary">
      <H2 center title="Découvrez les candidats" />
      {error ? (
        <Text variant="italic">{error}</Text>
      ) : (
        <Grid
          childWidths={['1-3@m']}
          gap="small"
          items={cvs.map((cv) => {
            return (
              <CandidatCard
                businessLines={cv.businessLines}
                url={cv.user && cv.user.url}
                imgSrc={
                  (cv.urlImg && `${process.env.AWSS3_CDN_URL}/${cv.urlImg}`) ||
                  undefined
                }
                firstName={cv.user && cv.user.candidat.firstName}
                ambitions={cv.ambitions}
                locations={cv.locations}
              />
            );
          })}
        />
      )}
      <StyledCVDiscoverButtonContainer>
        <Button
          variant="primary"
          rounded
          href={{ pathname: '/candidats', query: { employed: false } }}
        >
          Voir tous les candidats
        </Button>
      </StyledCVDiscoverButtonContainer>
    </Section>
  );
};
