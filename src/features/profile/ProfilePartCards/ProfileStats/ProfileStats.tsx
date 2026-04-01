import React, { useMemo } from 'react';
import { LucidIcon, Text } from '@/src/components/ui';
import { UserRoles } from '@/src/constants/users';
import {
  StyledIconContainer,
  StyledStatItem,
  StyledStatList,
  StyledStatTitleValue,
} from './ProfileStats.styles';

export interface ProfileStatsProps {
  createdAt: string | null;
  userRole: UserRoles;
  averageDelayResponse: number | null;
  lastConnection: string;
  responseRate: number | null;
  totalConversationWithMirrorRoleCount: number | null;
  isOwnProfile: boolean;
}

interface StatItem {
  value: string;
  icon: React.ReactNode;
}

export const ProfileStats = ({
  createdAt,
  userRole,
  averageDelayResponse,
  lastConnection,
  responseRate,
  totalConversationWithMirrorRoleCount,
  isOwnProfile,
}: ProfileStatsProps) => {
  const relativeConnectionDateInDays = useMemo(() => {
    if (!lastConnection) {
      return null;
    }
    const lastConnectionDate = new Date(lastConnection);
    return Math.floor(
      (Date.now() - lastConnectionDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }, [lastConnection]);

  const stats = useMemo(() => {
    const list = [] as StatItem[];

    if (createdAt && !isOwnProfile) {
      list.push({
        value: `Membre depuis le ${new Date(createdAt).toLocaleDateString(
          'fr-FR',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        )}`,
        icon: <LucidIcon name="Calendar" />,
      });
    }

    if (relativeConnectionDateInDays !== null && !isOwnProfile) {
      const relativeTimeText =
        relativeConnectionDateInDays === 0
          ? "aujourd'hui"
          : `il y'a ${relativeConnectionDateInDays} jour${
              relativeConnectionDateInDays > 1 ? 's' : ''
            }`;
      list.push({
        value: `Dernière connexion ${relativeTimeText}`,
        icon: <LucidIcon name="KeyRound" />,
      });
    }

    if (responseRate !== null) {
      list.push({
        value: `Répond à ${responseRate}% des messages`,
        icon: <LucidIcon name="MailCheck" />,
      });
    }

    if (averageDelayResponse !== null) {
      list.push({
        value: `Répond en moins d${averageDelayResponse > 1 ? 'e ' : "'"}${
          averageDelayResponse === 1 ? 'un' : averageDelayResponse
        } jour${averageDelayResponse > 1 ? 's' : ''}`,
        icon: <LucidIcon name="Timer" />,
      });
    }
    if (totalConversationWithMirrorRoleCount !== null) {
      if (userRole === UserRoles.COACH) {
        list.push({
          value: `${totalConversationWithMirrorRoleCount} candidats soutenus`,
          icon: <LucidIcon name="HandHeart" />,
        });
      }
    }
    return list;
  }, [
    createdAt,
    relativeConnectionDateInDays,
    isOwnProfile,
    responseRate,
    averageDelayResponse,
    totalConversationWithMirrorRoleCount,
    userRole,
  ]);

  return (
    <StyledStatList>
      {stats.map((stat) => (
        <StyledStatItem key={stat.value}>
          <StyledIconContainer>{stat.icon}</StyledIconContainer>
          <StyledStatTitleValue>
            <Text size="small">{stat.value}</Text>
          </StyledStatTitleValue>
        </StyledStatItem>
      ))}
    </StyledStatList>
  );
};
