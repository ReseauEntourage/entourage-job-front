import { PublicProfile } from '@/src/api/types';
import { Button } from '@/src/components/ui';
import { AvailabilityTag } from '@/src/components/ui/AvailabilityTag';
import { Badge, BadgeVariant } from '@/src/components/ui/Badge';
import { LucidIcon } from '@/src/components/ui/Icons';
import { ImgUserProfile } from '@/src/components/ui/Images/ImgProfile/ImgUserProfile/ImgUserProfile';
import { Text } from '@/src/components/ui/Text';
import { UserRoles } from '@/src/constants/users';
import {
  StyledCard,
  StyledCardBottom,
  StyledCardInfo,
  StyledCardName,
  StyledCardTags,
  StyledCardTop,
} from './WizardCompatibleProfileCard.styles';

interface WizardCompatibleProfileCardProps {
  profile: PublicProfile;
  subtitleContext: 'nudges' | 'sectors';
}

export const WizardCompatibleProfileCard = ({
  profile,
  subtitleContext,
}: WizardCompatibleProfileCardProps) => {
  const isCandidate = profile.role === UserRoles.CANDIDATE;
  const displayName = `${profile.firstName} ${profile.lastName.charAt(0)}.`;

  const sectorOccupations = profile.sectorOccupations ?? [];

  const occupationNames = sectorOccupations
    .map((so) => so.occupation?.name)
    .filter((name): name is string => Boolean(name));

  const metierText =
    occupationNames.length > 0
      ? occupationNames.join(', ')
      : profile.currentJob ?? null;

  const sectorNames = sectorOccupations
    .map((so) => so.businessSector?.name)
    .filter((name): name is string => Boolean(name));

  const nudges = profile.nudges ?? [];

  return (
    <StyledCard>
      <StyledCardTop>
        <ImgUserProfile
          user={profile}
          hasPicture={profile.hasPicture}
          size={48}
        />
        <StyledCardInfo>
          <StyledCardName>{displayName}</StyledCardName>
          {metierText && (
            <Text size="small" color="darkGray">
              {metierText}
            </Text>
          )}
          {subtitleContext === 'sectors' && sectorNames.length > 0 && (
            <StyledCardTags>
              {sectorNames.map((name) => (
                <Badge
                  key={name}
                  variant={BadgeVariant.HoverBlue}
                  borderRadius="large"
                >
                  <Text size="small" color="darkBlue">
                    {name}
                  </Text>
                </Badge>
              ))}
            </StyledCardTags>
          )}
          {subtitleContext === 'nudges' && nudges.length > 0 && (
            <StyledCardTags>
              {nudges.map((nudge) => {
                const label = isCandidate ? nudge.nameRequest : nudge.nameOffer;
                return (
                  <Badge
                    key={nudge.id}
                    variant={BadgeVariant.HoverBlue}
                    borderRadius="large"
                  >
                    <Text size="small" color="darkBlue">
                      {label}
                    </Text>
                  </Badge>
                );
              })}
            </StyledCardTags>
          )}
        </StyledCardInfo>
      </StyledCardTop>
      <StyledCardBottom>
        <AvailabilityTag isAvailable={profile.isAvailable} />
        <Button disabled>
          <LucidIcon name="Lock" size={12} />
          &nbsp; Contacter
        </Button>
      </StyledCardBottom>
    </StyledCard>
  );
};
