import React, { useMemo } from 'react';
import { Section } from '@/src/components/ui';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { Spinner } from '@/src/components/ui/Spinner';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import {
  HelpGroupsError,
  useGetHelpGroupDiscussionsInfiniteQuery,
  useGetHelpGroupQuery,
} from '@/src/use-cases/help-groups';
import { HelpGroupLoadError } from '../HelpGroupLoadError';
import { HelpGroupNotFound } from '../HelpGroupNotFound';
import { HELP_GROUPS_LOAD_ERROR_LABELS } from '../help-groups.labels';
import { useLoadMoreOnScroll } from '../hooks/useLoadMoreOnScroll';
import { DiscussionList } from './DiscussionList';
import { HelpGroupCharter } from './HelpGroupCharter';
import { HelpGroupHeader } from './HelpGroupHeader';
import { StyledHelpGroupPage } from './HelpGroupPage.styles';

interface HelpGroupPageProps {
  slug: string;
}

/**
 * Read-only group page: no join, publish, reply nor react action is shown,
 * not even disabled, until writing is available.
 */
export function HelpGroupPage({ slug }: HelpGroupPageProps) {
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
        <HelpGroupCharter charter={group.charter} />
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
