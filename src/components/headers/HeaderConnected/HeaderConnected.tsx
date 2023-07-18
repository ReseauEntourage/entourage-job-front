import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { useCandidateId } from 'src/components/backoffice/opportunities/useCandidateId';
import { renderLinks } from 'src/components/headers/HeaderConnected/HeaderConnectedContent/HeaderConnectedContent.utils';
import { useNotifBadges } from 'src/hooks/useNotifBadges';
import { usePrevious } from 'src/hooks/utils';
import { UserContext } from 'src/store/UserProvider';
import { HeaderConnectedContent } from './HeaderConnectedContent';

export const HeaderConnected = ({ isEmpty = false }: { isEmpty?: boolean }) => {
  const { user, logout } = useContext(UserContext);
  const { asPath } = useRouter();
  const candidateId = useCandidateId();

  const [LINKS_CONNECTED, setLinks] = useState(
    renderLinks(user, logout, candidateId)
  );

  const badges = useNotifBadges(user, asPath, candidateId);
  const prevUser = usePrevious(user);

  useEffect(() => {
    if (user && user !== prevUser) {
      setLinks(renderLinks(user, logout, candidateId));
    }
  }, [user, logout, prevUser, candidateId]);

  if (!user) return null;

  return (
    <HeaderConnectedContent
      badges={badges}
      links={LINKS_CONNECTED}
      isEmpty={isEmpty}
    />
  );
};
