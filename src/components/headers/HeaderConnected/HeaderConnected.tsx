import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useCandidateId } from 'src/components/backoffice/opportunities/useCandidateId';
import { renderLinks } from 'src/components/headers/HeaderConnected/HeaderConnectedContent/HeaderConnectedContent.utils';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
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
      links={LINKS_CONNECTED.links}
      dropdown={LINKS_CONNECTED.dropdown}
      isEmpty={isEmpty}
    />
  );
};
