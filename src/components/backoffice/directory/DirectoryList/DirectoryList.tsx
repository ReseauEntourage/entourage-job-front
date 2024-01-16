import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DirectoryItem } from '../DirectoryItem';
import { useDirectory } from '../useDirectory';
import { CardList } from 'src/components/utils/CardList';
import { useIsAtBottom } from 'src/hooks/useIsAtBottom';
import {
  fetchProfilesSelectors,
  profilesActions,
} from 'src/use-cases/profiles';
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
      return <DirectoryItem key={profile.id} {...profile} />;
    });
  }, [profiles]);

  return (
    <StyledDirectoryListContainer>
      <CardList list={profileList} isLoading={isFetchProfilesRequested} />
    </StyledDirectoryListContainer>
  );
}
