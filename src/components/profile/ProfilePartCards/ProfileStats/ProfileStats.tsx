import React from 'react';
import {
  IlluCalendrier,
  IlluDesktop,
  IlluDossierCandidat,
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
const stats = [
  {
    title: 'Taux de réponse',
    value: '100%',
    icon: <IlluDossierCandidat {...iconProps} />,
  },
  {
    title: 'Dernière connexion',
    value: 'il y a 2 jours',
    icon: <IlluDesktop {...iconProps} />,
  },
  {
    title: 'Temps de réponse',
    value: 'Moins de 24h',
    icon: <OrienterSablier {...iconProps} width={30} height={30} />,
  },
  {
    title: 'Evénements',
    value: '3 participations',
    icon: <IlluCalendrier {...iconProps} />,
  },
];

export interface ProfileStatsProps {
  smallCard?: boolean;
}

export const ProfileStats = ({ smallCard }: ProfileStatsProps) => {
  return (
    <ProfilePartCard title="Informations de connexion" smallCard={smallCard}>
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
