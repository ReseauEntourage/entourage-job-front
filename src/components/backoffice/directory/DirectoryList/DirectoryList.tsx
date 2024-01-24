import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DirectoryItem } from '../DirectoryItem';
import { useDirectory } from '../useDirectory';
import { CardList } from 'src/components/utils/CardList';
import { CANDIDATE_USER_ROLES } from 'src/constants/users';
import { useIsAtBottom } from 'src/hooks/useIsAtBottom';
import {
  fetchProfilesSelectors,
  profilesActions,
} from 'src/use-cases/profiles';
import { isRoleIncluded } from 'src/utils';
import { StyledDirectoryListContainer } from './DirectoryList.styles';

export function DirectoryList() {
  const { profiles } = useDirectory();

  const dispatch = useDispatch();

  useIsAtBottom(() => {
    dispatch(profilesActions.incrementProfilesOffset());
  });

  const isFetchProfilesRequested = useSelector(
    fetchProfilesSelectors.selectIsFetchProfilesRequested
  );

  const profileList = useMemo(() => {
    return profiles?.map((profile) => {
      const helps = isRoleIncluded(CANDIDATE_USER_ROLES, profile.role)
        ? profile.helpNeeds
        : profile.helpOffers;

      const businessLines = isRoleIncluded(CANDIDATE_USER_ROLES, profile.role)
        ? profile.searchBusinessLines
        : profile.networkBusinessLines;

      return (
        <DirectoryItem
          key={profile.id}
          id={profile.id}
          firstName={profile.firstName}
          lastName={profile.lastName}
          role={profile.role}
          department={profile.department}
          helps={helps}
          businessLines={businessLines}
          ambitions={profile.searchAmbitions}
          job={profile.currentJob}
        />
      );
    });
  }, [profiles]);

  return (
    <StyledDirectoryListContainer>
      <CardList list={profileList} isLoading={isFetchProfilesRequested} />
    </StyledDirectoryListContainer>
  );
}
