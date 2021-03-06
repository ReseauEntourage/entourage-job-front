import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { filtersToQueryParams } from 'src/utils';
import { Button, Grid } from 'src/components/utils';
import { CandidatCard } from 'src/components/cards';
import Api from 'src/Axios';
import { CV_FILTERS_DATA, INITIAL_NB_OF_CV_TO_DISPLAY } from 'src/constants';
import SimpleLink from 'src/components/utils/SimpleLink';
import { usePrevious } from 'src/hooks/utils';
import useDeepCompareEffect from 'use-deep-compare-effect';
import SearchBar from 'src/components/filters/SearchBar';
import { openModal } from 'src/components/modals/Modal';
import usePostPublicOfferModal from 'src/components/modals/usePostPublicOfferModal';
import { IconNoSSR } from 'src/components/utils/Icon';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';

const NoCVInThisArea = () => {
  return (
    <p className="uk-text-center uk-text-italic">
      LinkedOut se déploie dans les régions de Paris, de Lille et de Lyon. Vous
      ne trouvez pas de candidats LinkedOut dans votre région&nbsp;?
      Contactez-nous à{' '}
      <SimpleLink
        isExternal
        target="_blank"
        className="uk-link-text uk-text-primary"
        href={`mailto:${process.env.MAILJET_CONTACT_EMAIL}`}
      >
        {process.env.MAILJET_CONTACT_EMAIL}
      </SimpleLink>
    </p>
  );
};

const CVList = ({
  hideSearchBar,
  nb,
  search,
  filters,
  setFilters,
  setSearch,
  resetFilters,
}) => {
  const PublicOfferModal = usePostPublicOfferModal();

  const [numberOfResults, setNumberOfResults] = useState(0);

  const [cvs, setCVs] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasSuggestions, setHasSuggestions] = useState(false);

  const [error, setError] = useState(undefined);
  const defaultNbOfCVs = nb || INITIAL_NB_OF_CV_TO_DISPLAY;
  const [nbOfCVToDisplay, setNbOfCVToDisplay] = useState(defaultNbOfCVs);
  const prevNbOfCVToDisplay = usePrevious(nbOfCVToDisplay);

  const cvsLength = cvs?.length;
  const prevCVsLength = usePrevious(cvsLength);

  const fetchData = useCallback(
    (searchValue, filtersValue, nbOfCVToDisplayValue, isPagination) => {
      setError(undefined);

      if (isPagination) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      Api.get(`/cv/cards/random`, {
        params: {
          search: searchValue,
          nb: nbOfCVToDisplayValue,
          ...filtersToQueryParams(filtersValue),
        },
      })
        .then(({ data }) => {
          setHasSuggestions(data.suggestions);
          if (isPagination) {
            setCVs((prevCVs = []) => {
              return [
                ...prevCVs,
                ..._.differenceWith(data.cvs, prevCVs, (cv1, cv2) => {
                  return cv1.id === cv2.id;
                }),
              ];
            });
          } else {
            setNbOfCVToDisplay(defaultNbOfCVs);
            setCVs(data.cvs);
          }
        })
        .catch((err) => {
          console.error(err);
          setError('Impossible de récupérer les CVs.');
        })
        .finally(() => {
          setLoading(false);
          setLoadingMore(false);
        });
    },
    [defaultNbOfCVs]
  );

  useDeepCompareEffect(() => {
    if (
      nbOfCVToDisplay !== prevNbOfCVToDisplay &&
      nbOfCVToDisplay > defaultNbOfCVs
    ) {
      fetchData(search, filters, nbOfCVToDisplay, true);
    } else {
      fetchData(search, filters, nbOfCVToDisplay);
    }
  }, [fetchData, search, filters, nbOfCVToDisplay]);

  useEffect(() => {
    if (cvsLength !== prevCVsLength) {
      setNumberOfResults(cvsLength);
    }
  }, [cvsLength, prevCVsLength, setNumberOfResults]);

  const renderCvList = (items) => {
    return (
      <div
        className="cv-list"
        uk-scrollspy="cls:uk-animation-slide-bottom-small; target: .uk-card; delay: 200"
      >
        <Grid
          childWidths={['1-1', '1-2@s', '1-3@m']}
          gap="small"
          row
          center
          items={items.slice(0, nbOfCVToDisplay).map((cv) => {
            return (
              <CandidatCard
                businessLines={cv.businessLines}
                url={cv.user.url}
                imgSrc={
                  (cv.urlImg && process.env.AWSS3_CDN_URL + cv.urlImg) ||
                  undefined
                }
                imgAlt={cv.user.candidat.firstName}
                firstName={cv.user.candidat.firstName}
                gender={cv.user.candidat.gender}
                ambitions={cv.ambitions}
                locations={cv.locations}
                skills={cv.skills}
                catchphrase={cv.catchphrase}
                employed={cv.user.employed}
                endOfContract={cv.user.endOfContract}
                id={cv.user.candidat.id}
              />
            );
          })}
        />
        {!nb && (
          <div className="uk-flex uk-flex-center uk-margin-top">
            <Button
              style="primary"
              onClick={() => {
                setNbOfCVToDisplay((prevNbOfCV) => {
                  return prevNbOfCV + INITIAL_NB_OF_CV_TO_DISPLAY;
                });
              }}
            >
              Voir plus
              {loadingMore ? (
                <div
                  className="uk-margin-small-left"
                  data-uk-spinner="ratio: .6"
                />
              ) : (
                <IconNoSSR
                  className="uk-margin-small-left"
                  name="plus-circle"
                />
              )}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const getContent = () => {
    if (loading) {
      return <LoadingScreen />;
    }

    if (error) {
      return <p className="uk-text-center uk-text-italic">{error}</p>;
    }

    if (cvs && filters) {
      if (hasSuggestions) {
        return (
          <div>
            <p className="uk-text-center uk-text-italic">
              Nous n’avons aucun résultat pour votre recherche. Voici d’autres
              candidats dans la zone géographique sélectionnée qui pourraient
              correspondre.
            </p>
            <p className="uk-text-center uk-text-italic uk-margin-medium-bottom">
              Vous êtes recruteur&nbsp;?{' '}
              <a
                style={{
                  textDecoration: 'underline',
                }}
                className="uk-link-text"
                onClick={() => {
                  openModal(<PublicOfferModal />);
                }}
              >
                Publier une offre d’emploi
              </a>{' '}
              qui sera visible par tous les candidats LinkedOut, certains
              pourraient être intéressés&nbsp;!{' '}
            </p>
            {renderCvList(cvs)}
          </div>
        );
      }

      if (cvs.length <= 0) {
        if (
          filters &&
          filters[CV_FILTERS_DATA[1].key] &&
          filters[CV_FILTERS_DATA[1].key].length > 0
        ) {
          return <NoCVInThisArea />;
        }
        return <p className="uk-text-center uk-text-italic">Aucun CV trouvé</p>;
      }
      return renderCvList(cvs);
    }
  };

  return (
    <>
      {!hideSearchBar && (
        <SearchBar
          filtersConstants={CV_FILTERS_DATA}
          filters={filters}
          numberOfResults={numberOfResults}
          resetFilters={resetFilters}
          search={search}
          setSearch={setSearch}
          setFilters={setFilters}
          placeholder="Chercher un secteur d’activité, une compétence, un profil..."
        />
      )}

      {getContent()}
    </>
  );
};

CVList.propTypes = {
  hideSearchBar: PropTypes.bool,
  nb: PropTypes.number,
  search: PropTypes.string,
  filters: PropTypes.shape(),
  setFilters: PropTypes.func,
  setSearch: PropTypes.func,
  resetFilters: PropTypes.func,
};

CVList.defaultProps = {
  nb: undefined,
  search: undefined,
  filters: {},
  hideSearchBar: false,
  setFilters: () => {},
  setSearch: () => {},
  resetFilters: () => {},
};
export default CVList;
