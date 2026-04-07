import React, { useMemo } from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { AchievementType } from '@/src/api/types';
import { Card, LucidIcon, Text, Tooltip } from '@/src/components/ui';
import { ProgressBar } from '@/src/components/ui/ProgressBar/ProgressBar';
import { Skeleton } from '@/src/components/ui/Skeleton/Skeleton';
import { COLORS } from 'src/constants/styles';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledAchievementCard,
  StyledAchievementLeft,
  StyledAchievementRight,
  StyledAchievementTitleBlock,
  StyledIconCircle,
  StyledProgressLabel,
  StyledProgressRow,
  StyledProgressRowHeader,
  StyledTooltipContent,
} from './DashboardAchievementProgression.styles';
import { useDashboardAchievementStats } from './useDashboardAchievementStats';

const RESPONSE_RATE_THRESHOLD = 75;
const CONVERSATION_COUNT_THRESHOLD = 3;
const BADGE_DURATION_MONTHS = 6;

const tooltipContent = (
  <StyledTooltipContent>
    <Text weight="semibold">Ce que ça change pour les candidats</Text>
    <Text color="darkGray">
      <LucidIcon name="Eye" /> Votre profil remonte en priorité quand un
      candidat cherche un coach.
    </Text>
    <Text color="darkGray">
      <LucidIcon name="Mail" /> Les candidats osent écrire, en sachant
      qu&apos;ils auront une réponse.
    </Text>
    <Text color="darkGray">
      <LucidIcon name="Handshake" /> Un signal fort de leur démarche est pris au
      sérieux
    </Text>
  </StyledTooltipContent>
);

const formatExpiryDate = (createdAt: string): string => {
  const date = new Date(createdAt);
  date.setMonth(date.getMonth() + BADGE_DURATION_MONTHS);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const DashboardAchievementProgression = () => {
  const user = useAuthenticatedUser();
  const isDesktop = useIsDesktop();

  const superEngagedAchievement = useMemo(
    () =>
      user.achievements?.find(
        (a) => a.achievementType === AchievementType.SUPER_ENGAGED_COACH
      ) ?? null,
    [user.achievements]
  );

  const hasSuperEngagedBadge = superEngagedAchievement !== null;

  const { stats, isLoading } = useDashboardAchievementStats();
  const responseRate = stats.responseRate ?? 0;
  const conversationCount = stats.totalConversationWithMirrorRoleCount ?? 0;

  let badgeStatus: 'not_started' | 'in_progress' | 'obtained' = 'not_started';
  if (hasSuperEngagedBadge) {
    badgeStatus = 'obtained';
  } else if (responseRate > 0 || conversationCount > 0) {
    badgeStatus = 'in_progress';
  }

  const isResponseRateMet = responseRate >= RESPONSE_RATE_THRESHOLD;
  const isConversationMet = conversationCount >= CONVERSATION_COUNT_THRESHOLD;
  const isResponseRateAtRisk = hasSuperEngagedBadge && !isResponseRateMet;
  const isConversationAtRisk = hasSuperEngagedBadge && !isConversationMet;

  const isAtRisk =
    hasSuperEngagedBadge && (!isResponseRateMet || !isConversationMet);

  const pendingObjectivesCount = [isResponseRateMet, isConversationMet].filter(
    (met) => !met
  ).length;

  return (
    <Card>
      <StyledAchievementCard className={isDesktop ? '' : 'mobile'}>
        <StyledAchievementLeft>
          <StyledIconCircle $status={badgeStatus}>
            <SvgIcon name="SuperCoachDiamond" width={35} height={35} />
          </StyledIconCircle>
          <StyledAchievementTitleBlock>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Text size="normal" weight="semibold">
                Badge &quot;Super Engagé&quot;
                {hasSuperEngagedBadge ? ' obtenu' : ''}
              </Text>
              {isDesktop && (
                <Tooltip content={tooltipContent}>
                  <LucidIcon
                    name="CircleHelp"
                    size={16}
                    color={COLORS.mediumGray}
                  />
                </Tooltip>
              )}
            </div>
            {!hasSuperEngagedBadge ? (
              <Text size="small" color="darkGray">
                Encore {pendingObjectivesCount} objectif
                {pendingObjectivesCount > 1 ? 's' : ''} à atteindre
              </Text>
            ) : (
              <Text size="small" color="darkGray">
                Obtenu le{' '}
                {new Date(superEngagedAchievement.createdAt).toLocaleDateString(
                  'fr-FR',
                  {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }
                )}
              </Text>
            )}
          </StyledAchievementTitleBlock>
        </StyledAchievementLeft>

        <StyledAchievementRight>
          {isLoading ? (
            <>
              <Skeleton height="32px" />
              <Skeleton height="32px" />
            </>
          ) : (
            <>
              <StyledProgressRow>
                <StyledProgressRowHeader>
                  <StyledProgressLabel>
                    <LucidIcon
                      name="MailCheck"
                      size={16}
                      color={
                        isResponseRateAtRisk ? COLORS.lightRed : COLORS.black
                      }
                    />
                    <Text
                      size="small"
                      color={isResponseRateAtRisk ? 'lightRed' : 'black'}
                    >
                      Taux de réponse
                    </Text>
                  </StyledProgressLabel>
                  <Text
                    size="small"
                    color={isResponseRateAtRisk ? 'lightRed' : 'black'}
                    weight="semibold"
                  >
                    {Math.round(responseRate)}%
                  </Text>
                </StyledProgressRowHeader>
                <ProgressBar
                  value={Math.min(
                    (responseRate / RESPONSE_RATE_THRESHOLD) * 100,
                    100
                  )}
                  color={isResponseRateAtRisk ? 'lightRed' : 'primaryBlue'}
                />
              </StyledProgressRow>

              <StyledProgressRow>
                <StyledProgressRowHeader>
                  <StyledProgressLabel>
                    <LucidIcon
                      name="Timer"
                      size={16}
                      color={
                        isConversationAtRisk ? COLORS.lightRed : COLORS.black
                      }
                    />
                    <Text
                      size="small"
                      color={isConversationAtRisk ? 'lightRed' : 'black'}
                    >
                      Candidats aidés
                    </Text>
                  </StyledProgressLabel>
                  <Text
                    size="small"
                    color={isConversationAtRisk ? 'lightRed' : 'black'}
                    weight="semibold"
                  >
                    {conversationCount} / {CONVERSATION_COUNT_THRESHOLD}
                  </Text>
                </StyledProgressRowHeader>
                <ProgressBar
                  value={Math.min(
                    (conversationCount / CONVERSATION_COUNT_THRESHOLD) * 100,
                    100
                  )}
                  color={isConversationAtRisk ? 'lightRed' : 'primaryBlue'}
                />
              </StyledProgressRow>

              {isAtRisk && superEngagedAchievement && (
                <Text size="small" color="lightRed">
                  Agis avant le{' '}
                  {formatExpiryDate(superEngagedAchievement.createdAt)} pour
                  conserver ton badge
                </Text>
              )}
            </>
          )}
        </StyledAchievementRight>
      </StyledAchievementCard>
    </Card>
  );
};
