import React, { useMemo, useState } from 'react';
import { Section } from '@/src/components/ui';
import { H4 } from '@/src/components/ui/Headings';
import { Spinner } from '@/src/components/ui/Spinner';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { useIsDesktop } from '@/src/hooks/utils';
import {
  HelpGroupsError,
  useGetHelpGroupDiscussionsInfiniteQuery,
  useGetHelpGroupQuery,
} from '@/src/use-cases/help-groups';
import { DiscussionComposer } from '../DiscussionComposer';
import { EmailsSetting } from '../EmailsSetting';
import { HelpGroupLoadError } from '../HelpGroupLoadError';
import { HelpGroupMembers } from '../HelpGroupMembers';
import { HelpGroupNotFound } from '../HelpGroupNotFound';
import {
  HELP_GROUP_DISCUSSIONS_TITLE,
  HELP_GROUPS_LOAD_ERROR_LABELS,
} from '../help-groups.labels';
import { useLoadMoreOnScroll } from '../hooks/useLoadMoreOnScroll';
import { DiscussionList } from './DiscussionList';
import { HelpGroupCharter } from './HelpGroupCharter';
import { HelpGroupHeader } from './HelpGroupHeader';
import { HelpGroupInfoBlock } from './HelpGroupInfoBlock';
import {
  StyledDiscussionsSection,
  StyledHelpGroupPage,
  StyledHelpGroupPageAside,
  StyledHelpGroupPageMain,
} from './HelpGroupPage.styles';

interface HelpGroupPageProps {
  slug: string;
  // `?emails=1`, from the emails setting link: highlights the switch
  highlightEmails?: boolean;
}

/**
 * Group page. A member allowed to write gets the composer; anyone else gets
 * the invitation matching their situation instead (never disabled actions).
 * An unpublished group (admin preview) shows no write action at all.
 * Layout (design of 07/10/2026, recette of 08/10/2026): a full-width header
 * holding the adhesion action, then the information block, the composer and
 * the discussions on the left, « Les membres », « Le cadre » and the emails
 * setting on the right. Below the desktop breakpoint, a single column:
 * header (« Le cadre » collapsed in it), members, information, composer,
 * discussions, emails.
 */
export function HelpGroupPage({
  slug,
  highlightEmails = false,
}: HelpGroupPageProps) {
  const isDesktop = useIsDesktop();
  const [justJoined, setJustJoined] = useState(false);
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

  // Members only, whatever their write state
  const emailsSetting = group.isMember &&
    typeof group.emailsEnabled === 'boolean' && (
      <EmailsSetting
        slug={group.slug}
        emailsEnabled={group.emailsEnabled}
        isHighlighted={highlightEmails}
      />
    );

  return (
    <>
      <HelpGroupHeader
        group={group}
        justJoined={justJoined}
        onJoined={() => setJustJoined(true)}
      />
      <Section className="custom-page">
        <StyledHelpGroupPage>
          <StyledHelpGroupPageMain>
            {!isDesktop && <HelpGroupMembers group={group} />}
            <HelpGroupInfoBlock group={group} />
            {group.isPublished &&
              group.viewerPermissions.state === 'canWrite' && (
                <DiscussionComposer
                  // A fresh composer per group: draft, title proposal, state
                  key={group.id}
                  slug={group.slug}
                  groupId={group.id}
                  charterAccepted={group.viewerPermissions.charterAccepted}
                />
              )}
            <StyledDiscussionsSection aria-label={HELP_GROUP_DISCUSSIONS_TITLE}>
              <H4
                title={HELP_GROUP_DISCUSSIONS_TITLE}
                weight="semibold"
                noMarginBottom
              />
              {isLoadingDiscussions && <Spinner />}
              {/* A failed first page is not an empty group */}
              {!isLoadingDiscussions &&
                !(isDiscussionsError && discussions.length === 0) && (
                  <DiscussionList
                    groupSlug={group.slug}
                    discussions={discussions}
                  />
                )}
              {isFetchingNextPage && <Spinner />}
              {isDiscussionsError && !isFetchingDiscussions && (
                <HelpGroupLoadError
                  message={HELP_GROUPS_LOAD_ERROR_LABELS.discussions}
                  onRetry={
                    discussions.length === 0
                      ? refetchDiscussions
                      : fetchNextPage
                  }
                />
              )}
            </StyledDiscussionsSection>
            {!isDesktop && emailsSetting}
          </StyledHelpGroupPageMain>
          {isDesktop && (
            <StyledHelpGroupPageAside>
              <HelpGroupMembers group={group} />
              <HelpGroupCharter />
              {emailsSetting}
            </StyledHelpGroupPageAside>
          )}
        </StyledHelpGroupPage>
      </Section>
    </>
  );
}
