import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { renderLinks } from '@/src/features/navs/NavConnected/NavConnectedContent/NavConnectedContent.utils';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserCompany } from '@/src/hooks/current-user/useCurrentUserCompany';
import { useNotifBadges } from '@/src/hooks/useNotifBadges';
import { usePrevious } from '@/src/hooks/utils';
import { authenticationActions } from '@/src/use-cases/authentication';
import { useGetHelpGroupsQuery } from '@/src/use-cases/help-groups';
import {
  selectConversations,
  selectSelectedConversation,
  useGetUnseenConversationsCountQuery,
} from '@/src/use-cases/messaging';
import { useNotificationsRealtime } from '@/src/use-cases/notifications-center';
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

  // Same query as the groups list, shared through the RTK Query cache. The
  // entry stays hidden while loading or on error so it never shows up only to
  // vanish, and the admin actions invalidate the tag so it appears as soon as
  // the first group is published.
  const { data: helpGroups } = useGetHelpGroupsQuery();
  const hasPublishedHelpGroups = (helpGroups?.length ?? 0) > 0;

  const [linksConnected, setLinksConnected] = useState(
    renderLinks(user, logout, company, hasPublishedHelpGroups)
  );

  const badges = useNotifBadges();
  // The nav is mounted on every backoffice page: the subscription lasts the
  // session, and ends with the logout
  useNotificationsRealtime(user?.id);
  const prevUser = usePrevious(user);
  const prevHasPublishedHelpGroups = usePrevious(hasPublishedHelpGroups);

  useEffect(() => {
    if (
      user !== prevUser ||
      hasPublishedHelpGroups !== prevHasPublishedHelpGroups
    ) {
      setLinksConnected(
        renderLinks(user, logout, company, hasPublishedHelpGroups)
      );
    }
  }, [
    user,
    logout,
    prevUser,
    company,
    hasPublishedHelpGroups,
    prevHasPublishedHelpGroups,
  ]);

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
      administration={linksConnected.administration}
      dropdown={linksConnected.dropdown}
      messaging={linksConnected.messaging}
    />
  );
};
