import { PublicProfile } from '@/src/api/types';
import { Button, Card, Tooltip } from '@/src/components/ui';
import { AvailabilityTag } from '@/src/components/ui/AvailabilityTag';
import { Badge, BadgeVariant } from '@/src/components/ui/Badge';
import { StyledSeparator } from '@/src/components/ui/Cards/EntityCards/ProfileCard/ProfileCard.styles';
import { LucidIcon } from '@/src/components/ui/Icons';
import { ImgUserProfile } from '@/src/components/ui/Images/ImgProfile/ImgUserProfile/ImgUserProfile';
import { Text } from '@/src/components/ui/Text';
import { UserRoles } from '@/src/constants/users';
import { CVExperienceOrFormation } from '@/src/features/profile/CVExperienceOrFormation/CVExperienceOrFormation';
import {
  StyledCard,
  StyledCardBottom,
  StyledCardInfo,
  StyledCardName,
  StyledCardTags,
  StyledCardTop,
  StyledFullCard,
  StyledFullCTAWrapper,
  StyledFullSection,
  StyledFullSectorLine,
  StyledSkeletonAvatar,
  StyledSkeletonCTA,
  StyledSkeletonLine,
  StyledSkeletonTag,
} from './WizardCompatibleProfileCard.styles';

const EXPERIENCES_LIMIT = 2;
const FORMATIONS_LIMIT = 1;

interface WizardCompatibleProfileCardBaseProps {
  profile: PublicProfile;
  locked?: boolean;
}

type WizardCompatibleProfileCardProps = WizardCompatibleProfileCardBaseProps &
  (
    | { variant: 'compact'; subtitleContext: 'nudges' | 'sectors' }
    | { variant: 'full'; badgeLabel: string }
  );

const LockedCTA = () => (
  <Tooltip
    content={
      <>
        <LucidIcon name="Lock" size={12} />
        &nbsp; Finalisez votre inscription pour voir le profil
      </>
    }
    placement="top"
  >
    <Button disabled>
      <LucidIcon name="Lock" size={12} />
      &nbsp; Contacter
    </Button>
  </Tooltip>
);

function useWizardCompatibleProfileData(profile: PublicProfile) {
  const isCandidate = profile.role === UserRoles.CANDIDATE;
  const displayName = `${profile.firstName} ${profile.lastName.charAt(0)}.`;

  const sectorOccupations = profile.sectorOccupations ?? [];

  const sectorNames = sectorOccupations
    .map((so) => so.businessSector?.name)
    .filter((name): name is string => Boolean(name));

  const sectorOccupationLines = sectorOccupations
    .map((so) => {
      const sector = so.businessSector?.name;
      const occupation = so.occupation?.name;
      if (sector && occupation) {
        return `${sector} - ${occupation}`;
      }
      return sector ?? occupation ?? null;
    })
    .filter((line): line is string => Boolean(line));

  const occupationNames = sectorOccupations
    .map((so) => so.occupation?.name)
    .filter((name): name is string => Boolean(name));

  const metierText =
    occupationNames.length > 0
      ? occupationNames.join(', ')
      : profile.currentJob ?? null;

  const metierSource: 'occupation' | 'currentJob' | null =
    occupationNames.length > 0
      ? 'occupation'
      : profile.currentJob
      ? 'currentJob'
      : null;

  const nudges = (profile.nudges ?? []).map((nudge) => ({
    id: nudge.id,
    label: isCandidate ? nudge.nameRequest : nudge.nameOffer,
  }));

  const experiences = (profile.experiences ?? []).slice(0, EXPERIENCES_LIMIT);
  const formations = (profile.formations ?? []).slice(0, FORMATIONS_LIMIT);

  return {
    displayName,
    sectorNames,
    sectorOccupationLines,
    metierText,
    metierSource,
    nudges,
    experiences,
    formations,
  };
}

type WizardCompatibleProfileData = ReturnType<
  typeof useWizardCompatibleProfileData
>;

interface CompactProfileCardProps {
  profile: PublicProfile;
  locked: boolean;
  subtitleContext: 'nudges' | 'sectors';
  data: WizardCompatibleProfileData;
}

const CompactProfileCard = ({
  profile,
  locked,
  subtitleContext,
  data,
}: CompactProfileCardProps) => {
  const { displayName, metierText, sectorNames, nudges } = data;
  const showSectors = subtitleContext === 'sectors';
  const showNudges = subtitleContext === 'nudges';

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
          {showSectors && sectorNames.length > 0 && (
            <StyledCardTags>
              {sectorNames.map((name, i) => (
                <Badge
                  key={`${name}-${i}`}
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
          {showNudges && nudges.length > 0 && (
            <StyledCardTags>
              {nudges.map((nudge) => (
                <Badge
                  key={nudge.id}
                  variant={BadgeVariant.HoverBlue}
                  borderRadius="large"
                >
                  <Text size="small" color="darkBlue">
                    {nudge.label}
                  </Text>
                </Badge>
              ))}
            </StyledCardTags>
          )}
        </StyledCardInfo>
      </StyledCardTop>
      <StyledCardBottom>
        <AvailabilityTag isAvailable={profile.isAvailable} />
        {locked && <LockedCTA />}
      </StyledCardBottom>
    </StyledCard>
  );
};

interface FullProfileCardProps {
  profile: PublicProfile;
  locked: boolean;
  badgeLabel: string;
  data: WizardCompatibleProfileData;
}

const FullProfileCard = ({
  profile,
  locked,
  badgeLabel,
  data,
}: FullProfileCardProps) => {
  const {
    displayName,
    sectorOccupationLines,
    metierText,
    metierSource,
    nudges,
    experiences,
    formations,
  } = data;

  return (
    <Card>
      <StyledFullCard>
        <ImgUserProfile
          user={profile}
          hasPicture={profile.hasPicture}
          size={176}
        />
        <Badge variant={BadgeVariant.Primary} borderRadius="large">
          {badgeLabel}
        </Badge>
        <StyledCardName>{displayName}</StyledCardName>
        <AvailabilityTag isAvailable={profile.isAvailable} />
        {metierSource === 'currentJob' && (
          <StyledFullSectorLine>{metierText}</StyledFullSectorLine>
        )}
        {sectorOccupationLines.map((line, i) => (
          <StyledFullSectorLine key={`${line}-${i}`}>
            {line}
          </StyledFullSectorLine>
        ))}
        {nudges.length > 0 && (
          <StyledCardTags>
            {nudges.map((nudge) => (
              <Badge
                key={nudge.id}
                variant={BadgeVariant.HoverBlue}
                borderRadius="large"
              >
                <Text size="small" color="darkBlue">
                  {nudge.label}
                </Text>
              </Badge>
            ))}
          </StyledCardTags>
        )}
      </StyledFullCard>
      {experiences.length > 0 && (
        <StyledFullSection>
          <StyledSeparator />
          {experiences.map((experience) => (
            <CVExperienceOrFormation
              key={experience.id}
              title={experience.title}
              startDate={experience.startDate}
              endDate={experience.endDate}
              structure={experience.company}
              location={experience.location}
              skills={experience.skills}
              variant="summary"
            />
          ))}
        </StyledFullSection>
      )}
      {formations.length > 0 && (
        <StyledFullSection>
          <StyledSeparator />
          {formations.map((formation) => (
            <CVExperienceOrFormation
              key={formation.id}
              title={formation.title}
              startDate={formation.startDate}
              endDate={formation.endDate}
              structure={formation.institution}
              location={formation.location}
              skills={formation.skills}
              variant="summary"
            />
          ))}
        </StyledFullSection>
      )}
      {locked && (
        <StyledFullCTAWrapper>
          <LockedCTA />
        </StyledFullCTAWrapper>
      )}
    </Card>
  );
};

export const WizardCompatibleProfileCardSkeleton = () => (
  <StyledCard>
    <StyledCardTop>
      <StyledSkeletonAvatar />
      <StyledCardInfo>
        <StyledSkeletonLine width="70%" />
        <StyledSkeletonLine width="45%" />
        <StyledCardTags>
          <StyledSkeletonTag width="64px" />
          <StyledSkeletonTag width="48px" />
        </StyledCardTags>
      </StyledCardInfo>
    </StyledCardTop>
    <StyledCardBottom>
      <StyledSkeletonTag width="80px" />
      <StyledSkeletonCTA />
    </StyledCardBottom>
  </StyledCard>
);

export const WizardCompatibleProfileCard = (
  props: WizardCompatibleProfileCardProps
) => {
  const { profile, locked = false } = props;
  const data = useWizardCompatibleProfileData(profile);

  if (props.variant === 'compact') {
    return (
      <CompactProfileCard
        profile={profile}
        locked={locked}
        subtitleContext={props.subtitleContext}
        data={data}
      />
    );
  }

  return (
    <FullProfileCard
      profile={profile}
      locked={locked}
      badgeLabel={props.badgeLabel}
      data={data}
    />
  );
};
