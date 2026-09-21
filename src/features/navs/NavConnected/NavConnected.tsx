import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renderLinks } from '@/src/features/navs/NavConnected/NavConnectedContent/NavConnectedContent.utils';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserCompany } from '@/src/hooks/current-user/useCurrentUserCompany';
import { useNotifBadges } from '@/src/hooks/useNotifBadges';
import { usePrevious } from '@/src/hooks/utils';
import { authenticationActions } from '@/src/use-cases/authentication';
import {
  selectConversations,
  selectSelectedConversation,
  useGetUnseenConversationsCountQuery,
} from '@/src/use-cases/messaging';
import { NavConnectedContent } from './NavConnectedContent';

export const NavConnected = () => {
  const user = useAuthenticatedUser();
  const company = useCurrentUserCompany();
  const selectedConversation = useSelector(selectSelectedConversation);
  const conversations = useSelector(selectConversations);
  const dispatch = useDispatch();

  const logout = useCallback(async () => {
    dispatch(authenticationActions.logoutRequested());
  }, [dispatch]);

  const [linksConnected, setLinksConnected] = useState(
    renderLinks(user, logout, company)
  );

  const badges = useNotifBadges();
  const prevUser = usePrevious(user);

  useEffect(() => {
    if (user !== prevUser) {
      setLinksConnected(renderLinks(user, logout, company));
    }
  }, [user, logout, prevUser, company]);

  /**
   * This nav is mounted on every backoffice page, so subscribing here is
   * what keeps the unread-count entry alive app-wide. It previously relied
   * on the subscription the listener opened and never released — re-opened,
   * and leaked again, on every one of the refreshes below.
   */
  const { refetch: refetchUnseenCount } = useGetUnseenConversationsCountQuery();

  useEffect(() => {
    refetchUnseenCount();
  }, [refetchUnseenCount, user, selectedConversation, conversations]);

  return (
    <NavConnectedContent
      badges={badges}
      links={linksConnected.links}
      dropdown={linksConnected.dropdown}
      messaging={linksConnected.messaging}
    />
  );
};
