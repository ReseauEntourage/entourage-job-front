import _ from 'lodash';
import React, { useMemo } from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { AvailabilityTag } from '@/src/components/ui/AvailabilityTag';
import { H3, H6 } from '@/src/components/ui/Headings';
import { LegacyImg } from '@/src/components/ui/Images/LegacyImg';
import { RecommendationReasonBadge } from '@/src/components/ui/RecommendationReasonBadge/RecommendationReasonBadge';
import { Text } from '@/src/components/ui/Text';
import { Badge, BadgeVariant } from '../../../Badge';
import { Button } from '../../../Button';
import { EntityCard } from '../EntityCard/EntityCard';
import {
  BusinessSector,
  MatchingReason,
  Occupation,
  UserProfileSectorOccupation,
} from 'src/api/types';
import { DepartmentName } from 'src/constants/departements';
import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { UserRoles } from 'src/constants/users';
import { useImageFallback } from 'src/hooks/useImageFallback';
import { gaEvent } from 'src/lib/gtag';
import {
  StyledCTAContainer,
  StyledProfileCardAvailability,
  StyledProfileCardBusinessSectors,
  StyledProfileCardContent,
  StyledProfileCardDepartment,
  StyledProfileCardEmptyBusinessSectorsContainer,
  StyledProfileCardEmptyIcon,
  StyledProfileCardEmptyJobContainer,
  StyledProfileCardInfoContainer,
  StyledProfileCardJobContainer,
  StyledProfileCardLabel,
  StyledProfileCardName,
  StyledProfileCardPicture,
  StyledProfileCardPictureContainer,
  StyledProfileCardProfessionalSituation,
  StyledProfileCardRole,
  StyledSeparator,
} from './ProfileCard.styles';
import { RoleBadge } from './RoleBadge';

export interface ProfileCardProps {
  userId: string;
  firstName: string;
  lastName: string;
  role: UserRoles;
  hasPicture: boolean;
  sectorOccupations?: UserProfileSectorOccupation[];
  department?: DepartmentName;
  job?: string;
  isAvailable: boolean;
  currentJob?: string;
  recommendationReason?: MatchingReason | null;
}

const getLabelsDependingOnRole = (role: UserRoles) => {
  if (role === UserRoles.CANDIDATE) {
    return {
      businessSectors: 'Je recherche un emploi dans :',
      helps: "Je souhaite avoir de l'aide dans :",
      role: 'Candidat',
    };
  }
  if (role === UserRoles.COACH) {
    return {
      businessSectors: "J'ai du réseau dans :",
      helps: 'Je peux aider à :',
      role: 'Coach',
    };
  }
  return {};
};

const EMPTY_INFO = "Ces informations n'ont pas encore été renseignées";
const EMPTY_JOB = 'Métier non renseigné';

const iconSizeProps = { width: 40, height: 40 };

export function ProfileCard({
  userId,
  firstName,
  lastName,
  role,
  department,
  sectorOccupations,
  currentJob,
  isAvailable,
  hasPicture,
  recommendationReason,
}: ProfileCardProps) {
  const { urlImg } = useImageFallback({
    userId,
    hasPicture,
  });

  const labels = useMemo(() => getLabelsDependingOnRole(role), [role]);

  const sortedBusinessSectors = useMemo(() => {
    const items = sectorOccupations
      ?.filter((so) => !!so.businessSector)
      ?.map((so) => so.businessSector) as BusinessSector[];
    return _.uniqBy(items, 'id');
  }, [sectorOccupations]);

  const sortedOccupations = useMemo(() => {
    return sectorOccupations
      ?.filter((so) => !!so.occupation)
      ?.map((so) => so.occupation) as Occupation[];
  }, [sectorOccupations]);

  return (
    <EntityCard
      href={{
        pathname: `/backoffice/profile/[userId]`,
        query: { userId },
      }}
      onClick={() => {
        gaEvent(GA_TAGS.PAGE_ANNUAIRE_CARTE_CLIC);
      }}
    >
      <StyledProfileCardPictureContainer className="profile-card">
        <StyledProfileCardPicture>
          {urlImg ? (
            <LegacyImg src={urlImg} alt={`photo de ${firstName}`} cover />
          ) : (
            <LegacyImg
              src="/static/img/profile-placeholder.png"
              alt={`photo de ${firstName}`}
              cover
            />
          )}
          <LegacyImg src="/static/img/gradient.png" alt="" cover />
        </StyledProfileCardPicture>
        <StyledProfileCardAvailability>
          <AvailabilityTag isAvailable={isAvailable} />
        </StyledProfileCardAvailability>
        <StyledProfileCardInfoContainer>
          <StyledProfileCardName>
            <H3
              color={COLORS.white}
              title={`${firstName} ${lastName.charAt(0)}.`}
            />
          </StyledProfileCardName>
          {department && (
            <StyledProfileCardDepartment>
              <Text>{department}</Text>
            </StyledProfileCardDepartment>
          )}
        </StyledProfileCardInfoContainer>
        <StyledProfileCardRole>
          <RoleBadge role={role} />
        </StyledProfileCardRole>
      </StyledProfileCardPictureContainer>
      <StyledProfileCardContent>
        <StyledProfileCardProfessionalSituation>
          {(UserRoles.CANDIDATE === role || UserRoles.COACH === role) && (
            <>
              {role === UserRoles.COACH && (
                <StyledProfileCardJobContainer>
                  <H6 color={COLORS.black} title={currentJob || EMPTY_JOB} />
                </StyledProfileCardJobContainer>
              )}
              {role === UserRoles.CANDIDATE && (
                <>
                  {sortedOccupations && sortedOccupations.length > 0 ? (
                    <StyledProfileCardJobContainer>
                      {sortedOccupations.map(({ name }, index) => (
                        <H6
                          key={name}
                          color={COLORS.black}
                          title={`${_.capitalize(name)}${
                            index < sortedOccupations.length - 1 ? ',\xa0' : ''
                          }`}
                        />
                      ))}
                    </StyledProfileCardJobContainer>
                  ) : (
                    <StyledProfileCardEmptyJobContainer>
                      <H6 color={COLORS.black} title={EMPTY_JOB} />
                    </StyledProfileCardEmptyJobContainer>
                  )}
                </>
              )}
            </>
          )}
          <StyledProfileCardLabel>
            <Text color="darkGray">{labels.businessSectors}</Text>{' '}
          </StyledProfileCardLabel>
          <StyledProfileCardBusinessSectors>
            {sortedBusinessSectors && sortedBusinessSectors.length > 0 ? (
              <>
                {sortedBusinessSectors.slice(0, 2).map(({ id, name }) => {
                  return (
                    <Badge
                      variant={BadgeVariant.HoverBlue}
                      key={id}
                      borderRadius="large"
                    >
                      <Text size="small" color="darkBlue">
                        {name}
                      </Text>
                    </Badge>
                  );
                })}
                {role !== UserRoles.CANDIDATE &&
                  sortedBusinessSectors.length > 2 && (
                    <Badge
                      variant={BadgeVariant.HoverBlue}
                      borderRadius="large"
                    >
                      <Text size="small" color="darkBlue">
                        {`+${sortedBusinessSectors.length - 2}`}
                      </Text>
                    </Badge>
                  )}
              </>
            ) : (
              <StyledProfileCardEmptyBusinessSectorsContainer>
                <StyledProfileCardEmptyIcon>
                  <SvgIcon name="IlluMalette" {...iconSizeProps} />
                </StyledProfileCardEmptyIcon>
                <Text color="mediumGray" size="small" variant="italic">
                  {EMPTY_INFO}
                </Text>
              </StyledProfileCardEmptyBusinessSectorsContainer>
            )}
          </StyledProfileCardBusinessSectors>
        </StyledProfileCardProfessionalSituation>
        <StyledSeparator />
        {recommendationReason ? (
          <RecommendationReasonBadge reason={recommendationReason} />
        ) : (
          <StyledCTAContainer>
            <Button variant="secondary" rounded>
              Voir le profil
            </Button>
          </StyledCTAContainer>
        )}
      </StyledProfileCardContent>
    </EntityCard>
  );
}
