import React, { useMemo } from 'react';
import {
  IlluDossierCandidat,
  IlluOrdiCV,
  OrienterSablier,
} from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { Text } from 'src/components/utils';
import { COLORS } from 'src/constants/styles';
import {
  StyledIconContainer,
  StyledStatItem,
  StyledStatList,
  StyledStatTitleValue,
} from './ProfileStats.styles';

const iconProps = {
  width: 50,
  height: 50,
  color: COLORS.orangeSocial,
};

export interface ProfileStatsProps {
  smallCard?: boolean;
  averageDelayResponse?: number | null;
  lastConnection: string;
  responseRate?: number | null;
}

interface StatItem {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export const ProfileStats = ({
  smallCard,
  averageDelayResponse,
  lastConnection,
  responseRate,
}: ProfileStatsProps) => {
  const lastConnectionDate = new Date(lastConnection);
  const relativeConnectionDateInDays = Math.floor(
    (Date.now() - lastConnectionDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const stats = useMemo(() => {
    const list = [] as StatItem[];
    if (responseRate) {
      list.push({
        title: 'Taux de réponse',
        value: `${responseRate}%`,
        icon: <IlluDossierCandidat {...iconProps} />,
      });
    }
    list.push({
      title: 'Dernière connexion',
      value:
        relativeConnectionDateInDays === 0
          ? "Aujourd'hui"
          : `Il y'a ${relativeConnectionDateInDays} jour${
              relativeConnectionDateInDays > 1 ? 's' : ''
            }`,
      icon: <IlluOrdiCV {...iconProps} />,
    });
    if (averageDelayResponse) {
      list.push({
        title: 'Temps de réponse',
        value: `Moins d${
          averageDelayResponse > 1 ? 'e ' : "'"
        }${averageDelayResponse} jour${averageDelayResponse > 1 ? 's' : ''}`,
        icon: <OrienterSablier {...iconProps} width={25} height={25} />,
      });
    }
    return list;
  }, [averageDelayResponse, relativeConnectionDateInDays, responseRate]);

  return (
    <ProfilePartCard
      title="Informations de connexion"
      smallCard={smallCard}
      isCompleted
    >
      <StyledStatList>
        {stats.map((stat) => (
          <StyledStatItem key={stat.title}>
            <StyledIconContainer>{stat.icon}</StyledIconContainer>
            <StyledStatTitleValue>
              <Text size="large">{stat.title}</Text>
              <Text color="darkGray">{stat.value}</Text>
            </StyledStatTitleValue>
          </StyledStatItem>
        ))}
      </StyledStatList>
    </ProfilePartCard>
  );
};
