import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { Api } from 'src/api';
import { CV } from 'src/api/types';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { CandidatCard } from 'src/components/cards';
import { SearchBar } from 'src/components/filters/SearchBar/SearchBar';
import { Button, Grid, SimpleLink } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { CV_FILTERS_DATA, INITIAL_NB_OF_CV_TO_DISPLAY } from 'src/constants';
import { COLORS } from 'src/constants/styles';
import { FilterObject } from 'src/constants/utils';
import { usePrevious } from 'src/hooks/utils';
import { filtersToQueryParams } from 'src/utils/Filters';

const NoCVInThisArea = () => {
  return (
    <p className="uk-text-center uk-text-italic">
      Entourage Pro se déploie dans les régions de Paris, de Lille, de Lyon, de
      Rennes et de Lorient. Vous ne trouvez pas de candidats Entourage Pro dans
      votre région&nbsp;? Contactez-nous à{' '}
      <SimpleLink
        isExternal
        target="_blank"
        className="uk-link-text uk-text-primary"
        href={`mailto:${process.env.NEXT_PUBLIC_MAILJET_CONTACT_EMAIL}`}
      >
        {process.env.NEXT_PUBLIC_MAILJET_CONTACT_EMAIL}
      </SimpleLink>
    </p>
  );
};

interface CVListProps {
  hideSearchBar?: boolean;
  nb?: number;
  search?: string;
  filters: FilterObject<typeof CV_FILTERS_DATA>;
  setFilters?: (updatedFilters: FilterObject<typeof CV_FILTERS_DATA>) => void;
  setSearch?: (updatedSearch?: string) => void;
  resetFilters?: () => void;
}

export const CVList = ({
  hideSearchBar = false,
  nb,
  search,
  filters = {},
  setFilters = () => {},
  setSearch = () => {},
  resetFilters = () => {},
}: CVListProps) => {
  const [cvs, setCVs] = useState<CV[]>();
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasSuggestions, setHasSuggestions] = useState(false);

  const [error, setError] = useState<string>();
  const defaultNbOfCVs = nb || INITIAL_NB_OF_CV_TO_DISPLAY;
  const [nbOfCVToDisplay, setNbOfCVToDisplay] = useState(defaultNbOfCVs);
  const prevNbOfCVToDisplay = usePrevious(nbOfCVToDisplay);

  const fetchData = useCallback(
    (searchValue, filtersValue, nbOfCVToDisplayValue, isPagination = false) => {
      setError(undefined);

      if (isPagination) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      Api.getCVRandom({
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
                ..._.differenceWith(data.cvs, prevCVs, (cv1: CV, cv2: CV) => {
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

  const renderCvList = useCallback(
    (items) => {
      return (
        <div className="cv-list uk-margin-small-top">
          <Grid
            childWidths={['1-1', '1-2@s', '1-3@m']}
            gap="small"
            row
            center
            items={items.slice(0, nbOfCVToDisplay).map((cv) => {
              return (
                <CandidatCard
                  businessSectors={cv.businessSectors}
                  url={cv.user.url}
                  imgSrc={
                    (cv.urlImg &&
                      `${process.env.NEXT_PUBLIC_AWSS3_CDN_URL}/${cv.urlImg}`) ||
                    undefined
                  }
                  firstName={cv.user.candidat.firstName}
                  occupations={cv.occupations}
                  locations={cv.locations}
                />
              );
            })}
          />
          {!nb && (
            <div className="uk-flex uk-flex-center uk-margin-top">
              <Button
                variant="primary"
                onClick={() => {
                  setNbOfCVToDisplay((prevNbOfCV) => {
                    return prevNbOfCV + INITIAL_NB_OF_CV_TO_DISPLAY;
                  });
                }}
              >
                Voir plus
                {loadingMore ? (
                  <div style={{ color: COLORS.primaryBlue }} />
                ) : (
                  <LucidIcon name="Plus" />
                )}
              </Button>
            </div>
          )}
        </div>
      );
    },
    [loadingMore, nb, nbOfCVToDisplay]
  );

  const content = useMemo(() => {
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
  }, [cvs, error, filters, hasSuggestions, loading, renderCvList]);

  return (
    <div data-uk-scrollspy="cls:uk-animation-slide-bottom-small; target: .uk-card; delay: 200">
      {!hideSearchBar && (
        <SearchBar
          filtersConstants={CV_FILTERS_DATA}
          filters={filters}
          resetFilters={resetFilters}
          search={search}
          setSearch={setSearch}
          setFilters={setFilters}
          placeholder="Chercher un secteur d’activité, une compétence, un profil..."
        />
      )}
      {content}
    </div>
  );
};
