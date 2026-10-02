import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Section } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useGetHelpGroupsQuery } from '@/src/use-cases/help-groups';
import { getDefaultUrl } from '@/src/utils/Redirects';
import { HelpGroupLoadError } from '../HelpGroupLoadError';
import { HELP_GROUPS_LOAD_ERROR_LABELS } from '../help-groups.labels';
import { HelpGroupList } from './HelpGroupList';
import { StyledHelpGroupsHeader } from './HelpGroupList.styles';

/**
 * Without any published group the menu hides the entry, so a direct visit is
 * sent back to the role's default page rather than shown an empty list.
 */
export function HelpGroupsCatalog() {
  const { replace } = useRouter();
  const user = useAuthenticatedUser();
  const { data: groups, isLoading, isError, refetch } = useGetHelpGroupsQuery();
  const hasNoPublishedGroup = !isLoading && groups?.length === 0;

  useEffect(() => {
    if (hasNoPublishedGroup) {
      replace(getDefaultUrl(user.role));
    }
  }, [hasNoPublishedGroup, replace, user.role]);

  return (
    <Section className="custom-page">
      <StyledHelpGroupsHeader>
        <H2 title="Groupes" />
      </StyledHelpGroupsHeader>
      {isError && (
        <HelpGroupLoadError
          message={HELP_GROUPS_LOAD_ERROR_LABELS.groups}
          onRetry={refetch}
        />
      )}
      {!isError &&
        (isLoading || hasNoPublishedGroup ? (
          <LoadingScreen />
        ) : (
          <HelpGroupList groups={groups ?? []} />
        ))}
    </Section>
  );
}
