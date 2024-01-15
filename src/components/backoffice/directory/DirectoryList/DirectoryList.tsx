import React, { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { DirectoryItem } from '../DirectoryItem';
import { ProfileCard } from 'src/components/utils/Card/ProfileCard';
import { CardList } from 'src/components/utils/CardList';
import { USER_ROLES } from 'src/constants/users';
import { useLoadMore } from 'src/hooks/useLoadMore';
import { asyncTimeout } from 'src/utils/asyncTimeout';
import { StyledDirectoryListContainer } from './DirectoryList.styles';

type ProfileCardProps = React.ComponentProps<typeof ProfileCard>;

// TODO TO REMOVE, ONLY FOR TESTS
const cards: ProfileCardProps[] = new Array(25).fill({
  userId: uuid(),
  firstName: 'John',
  lastName: 'Doe',
  role: USER_ROLES.CANDIDATE,
  helps: [{ name: 'network' }, { name: 'cv' }],
  businessLines: [
    { name: 'id', order: 0 },
    { name: 'bat', order: 1 },
  ],
  ambitions: [
    { name: 'développeur', order: 0 },
    { name: 'ouvrier', order: 1 },
  ],
  department: 'Paris (75)',
});

export function DirectoryList() {
  const [profiles, setProfiles] = useState(cards);

  const { /* offset, resetOffset, */ isLoading } = useLoadMore(async () => {
    // TODO TO REMOVE, ONLY FOR TESTS
    await asyncTimeout(2000);
    // TODO dispatch more profiles
    setProfiles((prevProfiles) => [...prevProfiles, ...cards]);
  });

  useEffect(() => {
    // TODO listen to selector with profile list
    // setProfiles((prevProfiles) => [...prevProfiles, ... newProfiles]);
  });

  const profileList = useMemo(() => {
    return profiles.map((profile, key) => {
      return <DirectoryItem key={key} {...profile} />;
    });
  }, [profiles]);

  return (
    <StyledDirectoryListContainer>
      <CardList list={profileList} isLoading={isLoading} />
    </StyledDirectoryListContainer>
  );
}
