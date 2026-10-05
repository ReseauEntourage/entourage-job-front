import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Section } from '@/src/components/ui';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { Spinner } from '@/src/components/ui/Spinner';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { selectCurrentUser } from '@/src/use-cases/current-user';
import {
  HelpGroupsError,
  useGetHelpGroupDiscussionsInfiniteQuery,
  useGetHelpGroupQuery,
} from '@/src/use-cases/help-groups';
import { DiscussionComposer } from '../DiscussionComposer';
import { EmailsSetting } from '../EmailsSetting';
import { HelpGroupLoadError } from '../HelpGroupLoadError';
import { HelpGroupNotFound } from '../HelpGroupNotFound';
import { MembershipActions } from '../MembershipActions';
import { WelcomeInvite } from '../WelcomeInvite';
import { WriteInvitation } from '../WriteInvitation';
import { HELP_GROUPS_LOAD_ERROR_LABELS } from '../help-groups.labels';
import { useLoadMoreOnScroll } from '../hooks/useLoadMoreOnScroll';
import { DiscussionList } from './DiscussionList';
import { HelpGroupCharter } from './HelpGroupCharter';
import { HelpGroupHeader } from './HelpGroupHeader';
import { StyledHelpGroupPage } from './HelpGroupPage.styles';

interface HelpGroupPageProps {
  slug: string;
  // `?emails=1`, from the emails setting link: highlights the switch
  highlightEmails?: boolean;
}

/**
 * Group page. A member allowed to write gets the composer; anyone else gets
 * the invitation matching their situation instead (never disabled actions).
 * An unpublished group (admin preview) shows no write action at all.
 */
export function HelpGroupPage({
  slug,
  highlightEmails = false,
}: HelpGroupPageProps) {
  const currentUser = useSelector(selectCurrentUser);
  const [justJoined, setJustJoined] = useState(false);
  const [composerOpenSignal, setComposerOpenSignal] = useState(0);
  const {
    data: group,
    isLoading,
    error,
    refetch,
  } = useGetHelpGroupQuery(slug, { skip: !slug });
  const {
    data: discussionsData,
    isLoading: isLoadingDiscussions,
    isFetching: isFetchingDiscussions,
    isFetchingNextPage,
    isError: isDiscussionsError,
    hasNextPage,
    fetchNextPage,
    refetch: refetchDiscussions,
  } = useGetHelpGroupDiscussionsInfiniteQuery(slug, { skip: !group });

  const discussions = useMemo(
    () => discussionsData?.pages.flatMap(({ items }) => items) ?? [],
    [discussionsData]
  );

  useLoadMoreOnScroll({
    hasNextPage,
    isFetching: isFetchingDiscussions,
    hasError: isDiscussionsError,
    fetchNextPage,
  });

  if (error === HelpGroupsError.NOT_FOUND) {
    return <HelpGroupNotFound />;
  }
  if (error) {
    return (
      <Section className="custom-page">
        <HelpGroupLoadError
          message={HELP_GROUPS_LOAD_ERROR_LABELS.group}
          onRetry={refetch}
        />
      </Section>
    );
  }
  if (isLoading || !group) {
    return <LoadingScreen />;
  }

  return (
    <Section className="custom-page">
      <StyledHelpGroupPage>
        <Breadcrumb
          items={[
            { label: 'Groupes', href: '/backoffice/groupes' },
            { label: group.name },
          ]}
        />
        <HelpGroupHeader group={group} />
        {group.isPublished && group.viewerPermissions.state === 'canWrite' && (
          <MembershipActions slug={group.slug} justJoined={justJoined} />
        )}
        {/* Members only, whatever their write state */}
        {group.isMember && group.emailsEnabled !== null && (
          <EmailsSetting
            slug={group.slug}
            emailsEnabled={group.emailsEnabled}
            isHighlighted={highlightEmails}
          />
        )}
        <HelpGroupCharter />
        {group.isPublished &&
          (group.viewerPermissions.state === 'canWrite' ? (
            <>
              {group.viewerPermissions.showWelcomeInvite &&
                currentUser?.firstName && (
                  <WelcomeInvite
                    firstName={currentUser.firstName}
                    onClick={() => setComposerOpenSignal((count) => count + 1)}
                  />
                )}
              <DiscussionComposer
                // A fresh composer per group: draft, title proposal, state
                key={group.id}
                slug={group.slug}
                groupId={group.id}
                charterAccepted={group.viewerPermissions.charterAccepted}
                openSignal={composerOpenSignal}
              />
            </>
          ) : (
            <WriteInvitation
              slug={group.slug}
              state={group.viewerPermissions.state}
              onJoined={() => setJustJoined(true)}
            />
          ))}
        {isLoadingDiscussions && <Spinner />}
        {/* A failed first page is not an empty group */}
        {!isLoadingDiscussions &&
          !(isDiscussionsError && discussions.length === 0) && (
            <DiscussionList groupSlug={group.slug} discussions={discussions} />
          )}
        {isFetchingNextPage && <Spinner />}
        {isDiscussionsError && !isFetchingDiscussions && (
          <HelpGroupLoadError
            message={HELP_GROUPS_LOAD_ERROR_LABELS.discussions}
            onRetry={
              discussions.length === 0 ? refetchDiscussions : fetchNextPage
            }
          />
        )}
      </StyledHelpGroupPage>
    </Section>
  );
}
