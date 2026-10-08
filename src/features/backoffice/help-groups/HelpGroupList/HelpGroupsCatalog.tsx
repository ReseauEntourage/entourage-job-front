import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Button, LucidIcon, Section, Text } from '@/src/components/ui';
import { H1 } from '@/src/components/ui/Headings';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { openModal } from '@/src/features/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useGetHelpGroupsQuery } from '@/src/use-cases/help-groups';
import { getDefaultUrl } from '@/src/utils/Redirects';
import { HelpGroupLoadError } from '../HelpGroupLoadError';
import { HelpGroupsPageBackground } from '../HelpGroupsPageBackground';
import {
  HELP_GROUPS_INTRO,
  HELP_GROUPS_LOAD_ERROR_LABELS,
} from '../help-groups.labels';
import { HelpGroupList } from './HelpGroupList';
import {
  StyledHelpGroupsCatalog,
  StyledHelpGroupsIntro,
  StyledHelpGroupsIntroLead,
  StyledHelpGroupsIntroText,
  StyledHelpGroupsOverline,
} from './HelpGroupList.styles';
import { HelpGroupsCharterModal } from './HelpGroupsCharterModal';

/**
 * Overline, title and lead of the groups list, with a link to the frame
 * common to every group.
 */
export function HelpGroupsIntro() {
  return (
    <StyledHelpGroupsIntro data-testid="help-groups-intro">
      <StyledHelpGroupsIntroText>
        <StyledHelpGroupsOverline>
          <Text size="small" weight="semibold" color="teal" uppercase>
            {HELP_GROUPS_INTRO.overline}
          </Text>
        </StyledHelpGroupsOverline>
        <H1 title={HELP_GROUPS_INTRO.title} weight="semibold" noMarginBottom />
        <StyledHelpGroupsIntroLead>
          <Text size="large" color="darkGray">
            {HELP_GROUPS_INTRO.text}
          </Text>
        </StyledHelpGroupsIntroLead>
      </StyledHelpGroupsIntroText>
      <Button
        variant="text"
        weight="semibold"
        prependIcon={<LucidIcon name="ShieldCheck" />}
        onClick={() => openModal(<HelpGroupsCharterModal />)}
        dataTestId="help-groups-charter-link"
      >
        {HELP_GROUPS_INTRO.charterLink}
      </Button>
    </StyledHelpGroupsIntro>
  );
}

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
    <HelpGroupsPageBackground>
      <Section className="custom-page">
        <StyledHelpGroupsCatalog>
          <HelpGroupsIntro />
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
        </StyledHelpGroupsCatalog>
      </Section>
    </HelpGroupsPageBackground>
  );
}
