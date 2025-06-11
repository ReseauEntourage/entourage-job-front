import React from 'react';
import { Text } from 'src/components/utils';

export const CVDiscover = () => {
  // const [cvs, setCVs] = useState<CV[]>();
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   Api.getCVRandom({ nb: 3 })
  //     .then(({ data }) => {
  //       return setCVs(data.cvs);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       setError('Impossible de récupérer les CVs.');
  //     });
  // }, []);

  // if (cvs === undefined) return <LoadingScreen />;
  // return (
  //   <Section id="discover" className="custom-primary">
  //     <H2 center title="Découvrez les candidats" />
  //     {error ? (
  //       <Text variant="italic">{error}</Text>
  //     ) : (
  //       <Grid
  //         childWidths={['1-3@m']}
  //         gap="small"
  //         items={cvs.map((cv) => {
  //           return (
  //             <CandidatCard
  //               businessLines={cv.businessLines}
  //               url={cv.user && cv.user.url}
  //               imgSrc={
  //                 (cv.urlImg &&
  //                   `${process.env.NEXT_PUBLIC_AWSS3_CDN_URL}/${cv.urlImg}`) ||
  //                 ''
  //               }
  //               firstName={cv.user && cv.user.candidat.firstName}
  //               ambitions={cv.ambitions}
  //               locations={cv.locations}
  //             />
  //           );
  //         })}
  //       />
  //     )}
  //     <StyledCVDiscoverButtonContainer>
  //       <Button
  //         style="custom-secondary-inverted"
  //         href={{ pathname: '/candidats', query: { employed: false } }}
  //       >
  //         Voir tous les candidats
  //       </Button>
  //     </StyledCVDiscoverButtonContainer>
  //   </Section>
  // );

  return <Text>Aucun CV à afficher pour le moment.</Text>;
};
