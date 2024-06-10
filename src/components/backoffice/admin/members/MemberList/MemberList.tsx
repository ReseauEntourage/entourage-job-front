import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { MemberTable } from '../MemberTable';
import { Member } from '../MemberTable/Member';
import { MemberColumn } from '../MemberTable/Member/Member.types';
import { Api } from 'src/api';

import { UserWithUserCandidate } from 'src/api/types';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { AdminCreationButtons } from 'src/components/backoffice/admin/AdminCreationButtons';
import { SearchBar } from 'src/components/filters/SearchBar';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { BackToTop, Button, Section, Typography } from 'src/components/utils';
import { ContainerWithTextCentered } from 'src/components/utils/Containers';
import { StyledContainerWithTextCentered } from 'src/components/utils/Containers/Containers.styles';
import { H4 } from 'src/components/utils/Headings';
import { MEMBER_FILTERS_DATA } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { CANDIDATE_USER_ROLES } from 'src/constants/users';
import { FilterObject } from 'src/constants/utils';
import { useRole } from 'src/hooks/queryParams/useRole';
import { useBulkActions } from 'src/hooks/useBulkActions';
import { usePrevious } from 'src/hooks/utils';
import {
  filtersToQueryParams,
  mutateTypeFilterDependingOnRole,
} from 'src/utils/Filters';
import { isRoleIncluded } from 'src/utils/Finding';
import {
  StyledMemberListButtonContainer,
  StyleMemberTabContainer,
} from './MemberList.styles';

const LIMIT = 50;

interface MemberListProps {
  filters: FilterObject<typeof MEMBER_FILTERS_DATA>;
  setFilters: (
    updatedFilters: FilterObject<typeof MEMBER_FILTERS_DATA>
  ) => void;
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

  const [members, setMembers] = useState<UserWithUserCandidate[]>([]);
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

  const { selectElement, executeAction, hasSelection, resetSelection } =
    useBulkActions(
      'candidate',
      async () => {
        await fetchData(search, filters, role, offset, true);
      },
      GA_TAGS.BACKOFFICE_ADMIN_MASQUER_MASSE_CLIC
    );

  useDeepCompareEffect(() => {
    if (role) {
      fetchData(search, filters, role, offset, true);
      resetSelection();
    }
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
        <Section>
          <ContainerWithTextCentered>
            <H4 title={"Les membres n'ont pas pu etre chargés correctement."} />
            <Typography size="large">
              Contacte l&apos;équipe Entourage Pro pour en savoir plus.
            </Typography>
          </ContainerWithTextCentered>
        </Section>
      ) : (
        <>
          <Section className="custom-primary custom-fixed">
            <SearchBar
              filtersConstants={filtersConst}
              filters={filters}
              resetFilters={resetFilters}
              search={search}
              setSearch={setSearch}
              setFilters={setFilters}
              placeholder="Rechercher..."
              smallSelectors
              additionalButtons={
                isRoleIncluded(CANDIDATE_USER_ROLES, role) && (
                  <Button
                    style="custom-secondary-inverted"
                    size="small"
                    disabled={!hasSelection}
                    color="primaryBlue"
                    onClick={() => {
                      return executeAction({ hidden: true }, 'put');
                    }}
                  >
                    Masquer CV
                  </Button>
                )
              }
            />
          </Section>
          {loading ? (
            <LoadingScreen />
          ) : (
            <StyleMemberTabContainer>
              <MemberTable
                columns={memberColumns}
                members={memberList}
                role={role}
              />
            </StyleMemberTabContainer>
          )}
          {!loading && !allLoaded && (
            <StyledContainerWithTextCentered>
              <StyledMemberListButtonContainer>
                <Button
                  style="custom-secondary"
                  color="primaryBlue"
                  onClick={() =>
                    fetchData(search, filters, role, offset, false)
                  }
                >
                  Voir tous les&nbsp;{roleToDisplay}
                </Button>
              </StyledMemberListButtonContainer>
            </StyledContainerWithTextCentered>
          )}
          {!loading && allLoaded && members.length <= 0 && (
            <StyledContainerWithTextCentered>
              <Typography variant="italic" weight="bold">
                Aucun membre trouvé
              </Typography>
            </StyledContainerWithTextCentered>
          )}
        </>
      )}
    </>
  );
}
