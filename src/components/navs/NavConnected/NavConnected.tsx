import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renderLinks } from '@/src/components/navs/NavConnected/NavConnectedContent/NavConnectedContent.utils';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useCandidateId } from 'src/hooks/queryParams/useCandidateId';
import { useNotifBadges } from 'src/hooks/useNotifBadges';
import { usePrevious } from 'src/hooks/utils';
import { authenticationActions } from 'src/use-cases/authentication';
import {
  messagingActions,
  selectConversations,
  selectSelectedConversation,
} from 'src/use-cases/messaging';
import { NavConnectedContent } from './NavConnectedContent';

export const NavConnected = () => {
  const user = useAuthenticatedUser();
  const selectedConversation = useSelector(selectSelectedConversation);
  const conversations = useSelector(selectConversations);
  const { asPath } = useRouter();
  const candidateId = useCandidateId();
  const dispatch = useDispatch();

  const logout = useCallback(async () => {
    dispatch(authenticationActions.logoutRequested());
  }, [dispatch]);

  const [linksConnected, setLinksConnected] = useState(
    renderLinks(user, logout)
  );

  const badges = useNotifBadges(user, asPath, candidateId);
  const prevUser = usePrevious(user);

  useEffect(() => {
    if (user !== prevUser) {
      setLinksConnected(renderLinks(user, logout));
    }
  }, [user, logout, prevUser, candidateId]);

  useEffect(() => {
    dispatch(messagingActions.getUnseenConversationsCountRequested());
  }, [dispatch, user, selectedConversation, conversations]);

  return (
    <NavConnectedContent
      badges={badges}
      links={linksConnected.links}
      dropdown={linksConnected.dropdown}
      messaging={linksConnected.messaging}
    />
  );
};
