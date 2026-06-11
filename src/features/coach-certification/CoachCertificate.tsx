import React from 'react';
import { Text } from '@/src/components/ui';
import { H1, H3 } from '@/src/components/ui/Headings';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import { COLORS } from '@/src/constants/styles';
import { PublicAchievement } from 'src/api/types';
import {
  StyledBadgeWrapper,
  StyledCertificateCard,
  StyledDivider,
  StyledLogoWrapper,
  StyledPageWrapper,
} from './CoachCertificate.styles';

interface CoachCertificateProps {
  achievement: PublicAchievement;
}

export const CoachCertificate = ({ achievement }: CoachCertificateProps) => {
  const { firstName, lastName, achievedAt } = achievement;

  const formattedDate = new Date(achievedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <StyledPageWrapper>
      <StyledCertificateCard>
        <StyledBadgeWrapper>
          <SvgIcon name="SuperCoachRound" width={80} height={80} />
        </StyledBadgeWrapper>

        <Text weight="semibold" size="xlarge">
          CERTIFICAT
        </Text>

        <H1 title="Coach Entourage Pro" color={COLORS.primaryBlue} />

        <Text size="large" color="darkGray">
          Membre engagé en faveur de l&apos;égalité des chances
        </Text>

        <StyledDivider />

        <Text color="mediumGray" size="large">
          DÉCERNÉ À
        </Text>
        <H3
          color="black"
          weight="semibold"
          title={`${firstName} ${lastName.toUpperCase()}`}
        />

        <Text color="mediumGray">Le {formattedDate}</Text>

        <Text color="primaryBlue">www.entourage-pro.fr</Text>
      </StyledCertificateCard>
      <StyledLogoWrapper>
        <SvgIcon
          name="EntourageProLogoSecondary"
          width={220}
          height={80}
          color={COLORS.white}
        />
      </StyledLogoWrapper>
    </StyledPageWrapper>
  );
};
