import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { MemberTable } from '../MemberTable';
import { Member } from '../MemberTable/Member';
import { MemberColumn } from '../MemberTable/Member/Member.types';
import { Api } from 'src/api';

import { AdminCreationButtons } from 'src/components/backoffice/admin/AdminCreationButtons';
import { StyledActionsContainer } from 'src/components/backoffice/admin/members/MemberList/MemberList.styles';
import { LoadingScreen } from 'src/components/backoffice/cv/LoadingScreen';
import { SearchBar } from 'src/components/filters/SearchBar';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { Section, Button, BackToTop } from 'src/components/utils';
import { MEMBER_FILTERS_DATA } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { CANDIDATE_USER_ROLES } from 'src/constants/users';
import { useBulkActions } from 'src/hooks/useBulkActions';
import { usePrevious } from 'src/hooks/utils';
import {
  filtersToQueryParams,
  mutateTypeFilterDependingOnRole,
} from 'src/utils/Filters';
import { isRoleIncluded } from 'src/utils/Finding';
import { AnyToFix } from 'src/utils/Types';
import { useRole } from './useRole';

const LIMIT = 50;
interface MemberListProps {
  filters: AnyToFix; // to be typed
  setFilters: (updatedFilters: AnyToFix) => void;
  search?: string;
  setSearch: (search?: string) => void;
  resetFilters: () => void;
}

export function MemberList({
  search,
  filters = {},
  setFilters,
  setSearch,
  resetFilters,
}: MemberListProps) {
  const role = useRole();

  const prevRole = usePrevious(role);
  const [filtersConst, setFiltersConst] =
    useState<typeof MEMBER_FILTERS_DATA>(MEMBER_FILTERS_DATA);

  const [members, setMembers] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allLoaded, setAllLoaded] = useState(false);
  const [offset, setOffset] = useState(0);

  const fetchData = useCallback(
    async (searchValue, filtersValue, roleValue, offsetValue, doReset) => {
      setHasError(false);
      if (doReset) {
        setLoading(true);
        setMembers([]);
      }
      try {
        const { data: membersData } = await Api.getUsersMembers({
          params: {
            limit: LIMIT,
            offset: doReset ? 0 : offsetValue,
            role: roleValue,
            query: searchValue,
            ...filtersToQueryParams(filtersValue),
          },
        });

        if (doReset) {
          setMembers(membersData);
          setOffset(LIMIT);
          setAllLoaded(false);
        } else {
          setMembers((prevMembers) => {
            return [...prevMembers, ...membersData];
          });
          setOffset((prevOffset) => {
            return prevOffset + LIMIT;
          });
        }

        if (membersData.length < LIMIT) {
          setAllLoaded(true);
        }
      } catch (err) {
        console.error(err);
        setHasError(true);
      }

      setLoading(false);
    },
    []
  );

  const { selectElement, executeAction, hasSelection } = useBulkActions(
    'candidate',
    async () => {
      await fetchData(search, filters, role, offset, true);
    },
    GA_TAGS.BACKOFFICE_ADMIN_MASQUER_MASSE_CLIC
  );

  useDeepCompareEffect(() => {
    fetchData(search, filters, role, offset, true);
  }, [search, filters, role]);

  useEffect(() => {
    if (role !== prevRole) {
      setFiltersConst(
        mutateTypeFilterDependingOnRole(role) as typeof MEMBER_FILTERS_DATA
      );
    }
  }, [prevRole, role]);

  const handleSelectedMembers = useCallback(
    (memberId) => {
      selectElement({ id: memberId });
    },
    [selectElement]
  );

  const roleToDisplay = isRoleIncluded(CANDIDATE_USER_ROLES, role)
    ? 'candidats'
    : 'coachs';

  const memberColumns: MemberColumn[] = useMemo(
    () => [
      'associatedUser',
      'zone',
      'type',
      'lastConnection',
      'employed',
      'cvStatus',
      'cvHidden',
      'selection',
    ],
    []
  );

  const memberList = useMemo(() => {
    return members.map((member, key) => {
      return (
        <Member
          columns={memberColumns}
          role={role}
          member={member}
          key={key}
          selectionCallback={handleSelectedMembers}
        />
      );
    });
  }, [handleSelectedMembers, memberColumns, members, role]);

  return (
    <>
      <BackToTop />
      <HeaderBackoffice
        title={`Gestion des ${roleToDisplay}`}
        description={`Ici vous pouvez accéder à tous les profils des ${roleToDisplay} afin d'effectuer un suivi individuel de leur avancée.`}
        shouldDisplayAdminNotifications={isRoleIncluded(
          CANDIDATE_USER_ROLES,
          role
        )}
      >
        <AdminCreationButtons
          refreshList={() => fetchData(search, filters, role, offset, true)}
        />
      </HeaderBackoffice>
      {hasError ? (
        <Section className="uk-width-1-1">
          <div className=" uk-text-center uk-flex uk-flex-center">
            <div className="uk-width-xlarge">
              <h2 className="uk-margin-remove">
                Les membres n&apos;ont pas pu etre chargés correctement.
              </h2>
              <p>
                Contacte{' '}
                <span className="uk-text-primary">l&apos;équipe LinkedOut</span>{' '}
                pour en savoir plus.
              </p>
            </div>
          </div>
        </Section>
      ) : (
        <>
          <SearchBar
            filtersConstants={filtersConst}
            filters={filters}
            resetFilters={resetFilters}
            search={search}
            setSearch={setSearch}
            setFilters={setFilters}
            placeholder="Rechercher..."
            smallSelectors
          />
          {isRoleIncluded(CANDIDATE_USER_ROLES, role) && (
            <StyledActionsContainer>
              <Button
                style="custom-secondary"
                size="small"
                disabled={!hasSelection}
                color="primaryOrange"
                onClick={() => {
                  return executeAction({ hidden: true }, 'put');
                }}
              >
                Masquer CV
              </Button>
            </StyledActionsContainer>
          )}
          {loading ? (
            <LoadingScreen />
          ) : (
            <div className="uk-overflow-auto uk-margin-top">
              <MemberTable
                columns={memberColumns}
                members={memberList}
                role={role}
              />
            </div>
          )}
          {!loading && !allLoaded && (
            <div
              style={{ borderTop: '1px solid #e5e5e5' }}
              className="uk-text-center uk-width-1-1 uk-padding"
            >
              <Button
                style="custom-secondary"
                color="primaryOrange"
                onClick={() => fetchData(search, filters, role, offset, false)}
              >
                Voir tous les {roleToDisplay}
              </Button>
            </div>
          )}
          {!loading && allLoaded && members.length <= 0 && (
            <div className="uk-height-small uk-flex uk-flex-center uk-flex-middle">
              <p className="uk-text-italic">Aucun membre trouvé</p>
            </div>
          )}
        </>
      )}
    </>
  );
}
