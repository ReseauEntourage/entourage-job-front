import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { renderLinks } from 'src/components/headers/HeaderConnected/HeaderConnectedContent/HeaderConnectedContent.utils';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useCandidateId } from 'src/hooks/queryParams/useCandidateId';
import { useNotifBadges } from 'src/hooks/useNotifBadges';
import { usePrevious } from 'src/hooks/utils';
import { authenticationActions } from 'src/use-cases/authentication';
import { HeaderConnectedContent } from './HeaderConnectedContent';

export const HeaderConnected = ({ isEmpty = false }: { isEmpty?: boolean }) => {
  const user = useAuthenticatedUser();
  const { asPath } = useRouter();
  const candidateId = useCandidateId();
  const dispatch = useDispatch();

  const logout = useCallback(() => {
    dispatch(authenticationActions.logoutRequested());
  }, [dispatch]);

  const [linksConnected, setLinksConnected] = useState(
    renderLinks(user, logout, candidateId)
  );

  const badges = useNotifBadges(user, asPath, candidateId);
  const prevUser = usePrevious(user);

  useEffect(() => {
    if (user && user !== prevUser) {
      setLinksConnected(renderLinks(user, logout, candidateId));
    }
  }, [user, logout, prevUser, candidateId]);

  if (!user) return null;

  return (
    <HeaderConnectedContent
      badges={badges}
      links={linksConnected.links}
      dropdown={linksConnected.dropdown}
      isEmpty={isEmpty}
    />
  );
};
