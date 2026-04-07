import React from 'react';
import { useSelector } from 'react-redux';
import { SvgIcon } from '@/assets/icons/icons';
import { AchievementProgressionEntry, CriterionStat } from 'src/api/types';
import { Card, LucidIcon, Text, Tooltip } from 'src/components/ui';
import { ProgressBar } from 'src/components/ui/ProgressBar/ProgressBar';
import { Skeleton } from 'src/components/ui/Skeleton/Skeleton';
import { COLORS } from 'src/constants/styles';
import { useIsDesktop } from 'src/hooks/utils';
import {
  selectAchievementProgressions,
  selectGamificationIsInitialized,
} from 'src/use-cases/gamification';
import {
  StyledAchievementCard,
  StyledAchievementLeft,
  StyledAchievementRight,
  StyledAchievementTitleBlock,
  StyledIconCircle,
  StyledProgressLabel,
  StyledProgressRow,
  StyledProgressRowHeader,
} from './DashboardAchievementProgression.styles';
import {
  ACHIEVEMENT_SVG_ICON,
  ACHIEVEMENT_TOOLTIP,
  CRITERION_LUCID_ICON,
} from './achievement.icons';

interface CriterionRowProps {
  criterion: CriterionStat;
  isAtRisk: boolean;
}

const CriterionRow = ({ criterion, isAtRisk }: CriterionRowProps) => {
  const isMet = criterion.currentValue >= criterion.threshold;
  const isRisk = isAtRisk && !isMet;
  const iconName = CRITERION_LUCID_ICON[criterion.key] ?? 'Circle';
  const progressPercent = Math.min(
    (criterion.currentValue / criterion.threshold) * 100,
    100
  );
  const valueLabel =
    criterion.key === 'responseRate'
      ? `${Math.round(criterion.currentValue)}%`
      : `${criterion.currentValue} / ${criterion.threshold}`;

  return (
    <StyledProgressRow>
      <StyledProgressRowHeader>
        <StyledProgressLabel>
          <LucidIcon
            name={iconName}
            size={16}
            color={isRisk ? COLORS.lightRed : COLORS.black}
          />
          <Text size="small" color={isRisk ? 'lightRed' : 'black'}>
            {criterion.label}
          </Text>
        </StyledProgressLabel>
        <Text
          size="small"
          color={isRisk ? 'lightRed' : 'black'}
          weight="semibold"
        >
          {valueLabel}
        </Text>
      </StyledProgressRowHeader>
      <ProgressBar
        value={progressPercent}
        color={isRisk ? 'lightRed' : 'primaryBlue'}
      />
    </StyledProgressRow>
  );
};

interface AchievementCardProps {
  entry: AchievementProgressionEntry;
}

const AchievementCard = ({ entry }: AchievementCardProps) => {
  const isDesktop = useIsDesktop();

  const allCriteriaMet = entry.criteria.every(
    (c) => c.currentValue >= c.threshold
  );
  const hasProgress = entry.criteria.some((c) => c.currentValue > 0);
  const isAtRisk = entry.hasAchievement && !allCriteriaMet;
  const pendingCount = entry.criteria.filter(
    (c) => c.currentValue < c.threshold
  ).length;

  let badgeStatus: 'not_started' | 'in_progress' | 'obtained' = 'not_started';
  if (entry.hasAchievement) {
    badgeStatus = 'obtained';
  } else if (hasProgress) {
    badgeStatus = 'in_progress';
  }

  const svgIconName = ACHIEVEMENT_SVG_ICON[entry.type] ?? 'SuperCoachDiamond';
  const tooltipContent = ACHIEVEMENT_TOOLTIP[entry.type];

  return (
    <Card>
      <StyledAchievementCard>
        <StyledAchievementLeft>
          <StyledIconCircle $status={badgeStatus}>
            <SvgIcon name={svgIconName} width={35} height={35} />
          </StyledIconCircle>
          <StyledAchievementTitleBlock>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Text size="normal" weight="semibold">
                {entry.hasAchievement
                  ? `Badge "${entry.label}" obtenu`
                  : `Obtenez le badge "${entry.label}"`}
              </Text>
              {isDesktop && tooltipContent && (
                <Tooltip content={tooltipContent}>
                  <LucidIcon
                    name="CircleHelp"
                    size={16}
                    color={COLORS.mediumGray}
                  />
                </Tooltip>
              )}
            </div>
            {!entry.hasAchievement ? (
              <Text size="small" color="darkGray">
                Encore {pendingCount} objectif{pendingCount > 1 ? 's' : ''} à
                atteindre
              </Text>
            ) : (
              entry.achievedAt && (
                <Text size="small" color="darkGray">
                  Valide jusqu&apos;au{' '}
                  {new Date(entry.expireAt!).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
              )
            )}
          </StyledAchievementTitleBlock>
        </StyledAchievementLeft>

        <StyledAchievementRight>
          {entry.criteria.map((criterion) => (
            <CriterionRow
              key={criterion.key}
              criterion={criterion}
              isAtRisk={isAtRisk}
            />
          ))}
          {isAtRisk && entry.expireAt && (
            <Text size="small" color="lightRed">
              Agis avant le{' '}
              {new Date(entry.expireAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              pour conserver ton badge
            </Text>
          )}
          <Text size="small" color="darkGray">
            {(() => {
              const since = new Date();
              since.setMonth(since.getMonth() - entry.statsWindowMonths);
              return `Calculé depuis le ${since.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}`;
            })()}
          </Text>
        </StyledAchievementRight>
      </StyledAchievementCard>
    </Card>
  );
};

export const DashboardAchievementProgression = () => {
  const isInitialized = useSelector(selectGamificationIsInitialized);
  const progressions = useSelector(selectAchievementProgressions);

  if (!isInitialized) {
    return <Skeleton height="130px" />;
  }

  if (progressions.length === 0) {
    return null;
  }

  return (
    <>
      {progressions.map((entry) => (
        <AchievementCard key={entry.type} entry={entry} />
      ))}
    </>
  );
};
