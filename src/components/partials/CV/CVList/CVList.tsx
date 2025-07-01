import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Api } from 'src/api';
import { BusinessSector, Occupation, User } from 'src/api/types';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { CandidatCard } from 'src/components/cards';
import { SearchBar } from 'src/components/filters/SearchBar/SearchBar';
import { Button, Grid, SimpleLink } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { CV_FILTERS_DATA, INITIAL_NB_OF_CV_TO_DISPLAY } from 'src/constants';
import { COLORS } from 'src/constants/styles';
import { FilterObject } from 'src/constants/utils';
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
  const defaultLimit = nb || INITIAL_NB_OF_CV_TO_DISPLAY;
  const [items, setItems] = useState<User[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string>();
  const [endOfList, setEndOfList] = useState(false);

  const fetchData = useCallback(
    (searchValue, filtersValue, isPagination = false) => {
      setError(undefined);

      if (isPagination) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      Api.getPublicProfileList({
        search: searchValue,
        limit: defaultLimit,
        offset,
        ...filtersToQueryParams(filtersValue),
      })
        .then(({ data }) => {
          let countNewItems = 0;
          setItems((prevItems) => {
            const newItems = data.filter(
              (newItem) => !prevItems.some((item) => item.id === newItem.id)
            );
            countNewItems += newItems.length;
            return [...prevItems, ...newItems];
          });
          if (countNewItems === 0) {
            setEndOfList(true);
          }
          setOffset((prevOffset) => prevOffset + countNewItems);
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
    [defaultLimit, offset]
  );

  useEffect(() => {
    fetchData(search, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filters]);

  const renderCvList = useCallback(() => {
    return (
      <div className="cv-list uk-margin-small-top">
        <Grid
          childWidths={['1-1', '1-2@s', '1-3@m']}
          gap="small"
          row
          center
          items={items.map((user) => {
            const imgSrc = user.userProfile?.hasPicture
              ? `${process.env.NEXT_PUBLIC_AWSS3_URL}${process.env.NEXT_PUBLIC_AWSS3_IMAGE_DIRECTORY}${user.id}.profile.jpg`
              : undefined;
            return (
              <CandidatCard
                businessSectors={
                  (user.userProfile.sectorOccupations
                    ?.filter((so) => !!so.businessSector)
                    ?.map((so) => so.businessSector) as BusinessSector[]) || []
                }
                url={`${user.id}`}
                imgSrc={imgSrc}
                firstName={user.firstName}
                occupations={
                  (user.userProfile.sectorOccupations
                    ?.filter((so) => !!so.occupation)
                    ?.map((so) => so.occupation) as Occupation[]) || []
                }
                locations={[]}
              />
            );
          })}
        />
        {!nb && !endOfList && (
          <div className="uk-flex uk-flex-center uk-margin-top">
            <Button
              variant="primary"
              onClick={() => {
                fetchData(search, filters, true);
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
  }, [endOfList, fetchData, filters, items, loadingMore, nb, search]);

  const content = useMemo(() => {
    if (loading) {
      return <LoadingScreen />;
    }

    if (error) {
      return <p className="uk-text-center uk-text-italic">{error}</p>;
    }

    if (items && filters) {
      if (items.length <= 0) {
        if (
          filters &&
          filters[CV_FILTERS_DATA[1].key] &&
          filters[CV_FILTERS_DATA[1].key].length > 0
        ) {
          return <NoCVInThisArea />;
        }
        return (
          <p className="uk-text-center uk-text-italic">
            Aucun profil correspondat trouvé
          </p>
        );
      }
      return renderCvList();
    }
  }, [items, error, filters, loading, renderCvList]);

  return (
    <div>
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
