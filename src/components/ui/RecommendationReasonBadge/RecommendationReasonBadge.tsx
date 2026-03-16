import React from 'react';
import { Text } from '@/src/components/ui';
import { Color } from '@/src/constants/styles';
import { Badge, BadgeVariant } from '../Badge';
import { IconName, LucidIcon } from '../Icons';
import { MatchingReason } from 'src/api/types';
import { UserRoles } from 'src/constants/users';
import {
  StyledBadgeContainer,
  StyledBadgeContent,
  StyledIconContainer,
} from './RecommendationReasonBadge.styles';

interface ReasonConfig {
  icon: IconName;
  label: string;
  subtext: string;
  variant: BadgeVariant;
  accentColor: Color;
  textColor: Color;
}

type ReasonConfigByRole = {
  [role in UserRoles.CANDIDATE | UserRoles.COACH]: ReasonConfig;
} & { default: ReasonConfig };

const REASON_CONFIG: Record<MatchingReason, ReasonConfigByRole | ReasonConfig> =
  {
    needs: {
      [UserRoles.CANDIDATE]: {
        icon: 'Target',
        label: 'Correspond à vos propositions',
        subtext: 'Ses besoins matchent vos propositions',
        variant: BadgeVariant.ExtraLightTeal,
        accentColor: 'teal',
        textColor: 'teal',
      },
      [UserRoles.COACH]: {
        icon: 'Target',
        label: 'Correspond à vos besoins',
        subtext: 'Ses propositions matchent vos besoins',
        variant: BadgeVariant.ExtraLightTeal,
        accentColor: 'teal',
        textColor: 'teal',
      },
      default: {
        icon: 'Target',
        label: 'Correspond à vos besoins',
        subtext: 'Ses propositions matchent vos besoins',
        variant: BadgeVariant.ExtraLightTeal,
        accentColor: 'teal',
        textColor: 'teal',
      },
    },
    profile: {
      [UserRoles.CANDIDATE]: {
        icon: 'Briefcase',
        label: 'Profil complémentaire',
        subtext: 'Son parcours correspond à votre projet pro',
        variant: BadgeVariant.ExtraLightPurple,
        accentColor: 'purple',
        textColor: 'purple',
      },
      [UserRoles.COACH]: {
        icon: 'Briefcase',
        label: 'Profil complémentaire',
        subtext: 'Son parcours correspond à votre expertise',
        variant: BadgeVariant.ExtraLightPurple,
        accentColor: 'purple',
        textColor: 'purple',
      },
      default: {
        icon: 'Briefcase',
        label: 'Profil complémentaire',
        subtext: 'Son parcours correspond à votre expertise',
        variant: BadgeVariant.ExtraLightPurple,
        accentColor: 'purple',
        textColor: 'purple',
      },
    },
    activity: {
      icon: 'Zap',
      label: 'Très réactif(ve)',
      subtext: 'Répond généralement en moins de 24h',
      variant: BadgeVariant.ExtraLightGreen,
      accentColor: 'green',
      textColor: 'mediumGreen',
    },
    locationCompatibility: {
      icon: 'MapPinHouse',
      label: 'Proche de vous',
      subtext: 'Dans votre zone géographique',
      variant: BadgeVariant.ExtraLightAmber,
      accentColor: 'amber',
      textColor: 'amber',
    },
  };

function getConfig(
  reason: MatchingReason,
  role?: UserRoles
): ReasonConfig | null {
  const entry = REASON_CONFIG[reason];
  if (!entry) {
    return null;
  }
  if ('icon' in entry) {
    return entry as ReasonConfig;
  }
  const byRole = entry as ReasonConfigByRole;
  if (role === UserRoles.CANDIDATE || role === UserRoles.COACH) {
    return byRole[role];
  }
  return byRole.default;
}

interface RecommendationReasonBadgeProps {
  reason: MatchingReason;
  role?: UserRoles;
}

export function RecommendationReasonBadge({
  reason,
  role,
}: RecommendationReasonBadgeProps) {
  const config = getConfig(reason, role);
  if (!config) {
    return null;
  }

  return (
    <Badge variant={config.variant}>
      <StyledBadgeContainer>
        <StyledIconContainer $bgColor={config.accentColor}>
          <LucidIcon name={config.icon} size={16} color="white" />
        </StyledIconContainer>
        <StyledBadgeContent>
          <Text weight="semibold" size="small" color={config.textColor}>
            {config.label}
          </Text>
          <Text size="small" color={config.textColor}>
            {config.subtext}
          </Text>
        </StyledBadgeContent>
      </StyledBadgeContainer>
    </Badge>
  );
}
