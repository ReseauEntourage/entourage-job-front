import _ from 'lodash';
import React, { useMemo } from 'react';
import { LegacyImg } from '@/src/components/utils/Images/LegacyImg';
import { ProfileNudges } from '@/src/constants/nudges';
import HandsIcon from 'assets/icons/illu-coeur-mains-ouvertes.svg';
import CaseIcon from 'assets/icons/illu-malette.svg';
import { Button } from '../../../Button';
import { EntityCard } from '../EntityCard/EntityCard';
import {
  BusinessSector,
  Nudge,
  Occupation,
  UserProfileSectorOccupation,
} from 'src/api/types';
import { AvailabilityTag } from 'src/components/utils/AvailabilityTag';
import { H3, H5 } from 'src/components/utils/Headings';
import { Tag } from 'src/components/utils/Tag';
import { Text } from 'src/components/utils/Text';
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
  StyledProfileCardEmptyNudgesContainer,
  StyledProfileCardEmptyIcon,
  StyledProfileCardEmptyJobContainer,
  StyledProfileCardNudge,
  StyledProfileCardNudgeContainer,
  StyledProfileCardNudgeLabel,
  StyledProfileCardInfoContainer,
  StyledProfileCardJobContainer,
  StyledProfileCardLabel,
  StyledProfileCardName,
  StyledProfileCardPicture,
  StyledProfileCardPictureContainer,
  StyledProfileCardProfessionalSituation,
  StyledProfileCardRole,
  StyledSeparator,
  StyledProfileCardNudges,
} from './ProfileCard.styles';

export interface ProfileCardProps {
  userId: string;
  firstName: string;
  lastName: string;
  role: UserRoles;
  hasPicture: boolean;
  nudges?: Nudge[];
  sectorOccupations?: UserProfileSectorOccupation[];
  department?: DepartmentName;
  job?: string;
  isAvailable: boolean;
  displayNudges?: boolean;
  currentJob?: string;
}

const getLabelsDependingOnRole = (role: UserRoles) => {
  if (role === UserRoles.CANDIDATE) {
    return {
      businessSectors: 'Je recherche un emploi dans\xa0:',
      helps: "Je souhaite avoir de l'aide dans\xa0:",
      role: 'Candidat',
    };
  }
  if (role === UserRoles.COACH) {
    return {
      businessSectors: "J'ai du réseau dans\xa0:",
      helps: 'Je peux aider à\xa0:',
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
  nudges,
  sectorOccupations,
  currentJob,
  isAvailable,
  displayNudges,
  hasPicture,
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
          <Tag content={labels.role} style="secondary" />
        </StyledProfileCardRole>
      </StyledProfileCardPictureContainer>
      <StyledProfileCardContent>
        <StyledProfileCardProfessionalSituation>
          {(UserRoles.CANDIDATE === role || UserRoles.COACH === role) && (
            <>
              {role === UserRoles.COACH && (
                <StyledProfileCardJobContainer>
                  <H5 color={COLORS.black} title={currentJob || EMPTY_JOB} />
                </StyledProfileCardJobContainer>
              )}
              {role === UserRoles.CANDIDATE && (
                <>
                  {sortedOccupations && sortedOccupations.length > 0 ? (
                    <StyledProfileCardJobContainer>
                      {sortedOccupations.map(({ name }, index) => (
                        <H5
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
                      <H5 color={COLORS.black} title={EMPTY_JOB} />
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
                  return <Tag key={id} content={name} />;
                })}
                {role !== UserRoles.CANDIDATE &&
                  sortedBusinessSectors.length > 2 && (
                    <Tag content={`+${sortedBusinessSectors.length - 2}`} />
                  )}
              </>
            ) : (
              <StyledProfileCardEmptyBusinessSectorsContainer>
                <StyledProfileCardEmptyIcon>
                  <CaseIcon {...iconSizeProps} />
                </StyledProfileCardEmptyIcon>
                <Text color="mediumGray" size="small" variant="italic">
                  {EMPTY_INFO}
                </Text>
              </StyledProfileCardEmptyBusinessSectorsContainer>
            )}
          </StyledProfileCardBusinessSectors>
        </StyledProfileCardProfessionalSituation>
        <StyledSeparator />
        {displayNudges ? (
          <StyledProfileCardNudgeContainer>
            <StyledProfileCardLabel>
              <Text color="darkGray">{labels.helps}</Text>
            </StyledProfileCardLabel>
            <StyledProfileCardNudges>
              {nudges && nudges?.length > 0 ? (
                nudges.map((nudge) => {
                  const nudgeDetails = ProfileNudges.find(
                    (n) => nudge?.value === n.value
                  );
                  return (
                    <StyledProfileCardNudge key={nudgeDetails?.value}>
                      {nudgeDetails?.icon}
                      <StyledProfileCardNudgeLabel>
                        {nudgeDetails?.label}
                      </StyledProfileCardNudgeLabel>
                    </StyledProfileCardNudge>
                  );
                })
              ) : (
                <StyledProfileCardEmptyNudgesContainer>
                  <StyledProfileCardEmptyIcon>
                    <HandsIcon {...iconSizeProps} />
                  </StyledProfileCardEmptyIcon>
                  <Text color="mediumGray" size="small" variant="italic">
                    {EMPTY_INFO}
                  </Text>
                </StyledProfileCardEmptyNudgesContainer>
              )}
            </StyledProfileCardNudges>
          </StyledProfileCardNudgeContainer>
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
