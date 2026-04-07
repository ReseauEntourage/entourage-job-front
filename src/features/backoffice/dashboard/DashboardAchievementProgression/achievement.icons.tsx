import React from 'react';
import { SvgIcons } from '@/assets/icons/icons';
import { AchievementType } from 'src/api/types';
import { IconName, LucidIcon, Text } from 'src/components/ui';
import { StyledTooltipContent } from './DashboardAchievementProgression.styles';

/**
 * Maps each achievement type to the name of the SVG badge icon to display.
 * Add new entries here when introducing new achievements.
 */
export const ACHIEVEMENT_SVG_ICON: Record<
  AchievementType,
  keyof typeof SvgIcons
> = {
  [AchievementType.SUPER_ENGAGED_COACH]: 'SuperCoachDiamond',
};

/**
 * Maps each criterion key to a Lucide icon name for the progress rows.
 * Add new entries here when introducing criteria with new keys.
 */
export const CRITERION_LUCID_ICON: Record<string, IconName> = {
  responseRate: 'MailCheck',
  conversationCount: 'Timer',
};

/**
 * Optional tooltip content shown next to each achievement title.
 * Return null here (or omit the key) for achievements with no tooltip.
 */
export const ACHIEVEMENT_TOOLTIP: Partial<
  Record<AchievementType, React.ReactNode>
> = {
  [AchievementType.SUPER_ENGAGED_COACH]: (
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
        <LucidIcon name="Handshake" /> Un signal fort de leur démarche est pris
        au sérieux
      </Text>
    </StyledTooltipContent>
  ),
};
