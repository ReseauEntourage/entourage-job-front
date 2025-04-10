import _ from 'lodash';
import Link from 'next/link';
import React, { useMemo } from 'react';
import HandsIcon from 'assets/icons/illu-coeur-mains-ouvertes.svg';
import CaseIcon from 'assets/icons/illu-malette.svg';
import { Button } from '../../Button';
import {
  BusinessSector,
  Occupation,
  UserCandidateWithUsers,
  UserProfileSectorOccupation,
} from 'src/api/types';
import { AvailabilityTag } from 'src/components/utils/AvailabilityTag';
import { H3, H5 } from 'src/components/utils/Headings';
import { Img } from 'src/components/utils/Img';
import { Tag } from 'src/components/utils/Tag';
import { Text } from 'src/components/utils/Text';
import { Department } from 'src/constants/departements';
import { HelpValue, ProfileHelps } from 'src/constants/helps';
import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import { USER_ROLES, UserRole } from 'src/constants/users';
import { useImageFallback } from 'src/hooks/useImageFallback';
import { gaEvent } from 'src/lib/gtag';
import { findConstantFromValue } from 'src/utils';
import {
  StyledCTAContainer,
  StyledProfileCard,
  StyledProfileCardAvailability,
  StyledProfileCardBusinessSectors,
  StyledProfileCardContent,
  StyledProfileCardDepartment,
  StyledProfileCardEmptyBusinessSectorsContainer,
  StyledProfileCardEmptyHelpsContainer,
  StyledProfileCardEmptyIcon,
  StyledProfileCardEmptyJobContainer,
  StyledProfileCardHelp,
  StyledProfileCardHelpContainer,
  StyledProfileCardHelpLabel,
  StyledProfileCardHelps,
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

export interface ProfileCardProps {
  userId: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  helps?: {
    name: HelpValue;
  }[];
  sectorOccupations?: UserProfileSectorOccupation[];
  userCandidate?: UserCandidateWithUsers;
  department?: Department;
  job?: string;
  isAvailable: boolean;
  displayHelps?: boolean;
}

const getLabelsDependingOnRole = (role: UserRole) => {
  if (role === USER_ROLES.CANDIDATE) {
    return {
      businessSectors: 'Je recherche un emploi dans\xa0:',
      helps: "Je souhaite avoir de l'aide dans\xa0:",
      role: 'Candidat',
    };
  }
  if (role === USER_ROLES.COACH) {
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
  helps,
  sectorOccupations,
  userCandidate,
  isAvailable,
  displayHelps,
}: ProfileCardProps) {
  const { urlImg, fallbackToCVImage } = useImageFallback({
    userId,
    role,
    userCandidate,
  });

  const labels = useMemo(() => getLabelsDependingOnRole(role), [role]);

  const sortedSectorOccupations = useMemo(() => {
    return (
      sectorOccupations?.sort((so1, so2) => {
        return so1.order - so2.order;
      }) ?? []
    );
  }, [sectorOccupations]);

  const sortedBusinessSectors = useMemo(() => {
    return sortedSectorOccupations
      ?.filter((so) => !!so.businessSector)
      ?.map((so) => so.businessSector) as BusinessSector[];
  }, [sortedSectorOccupations]);

  const sortedOccupations = useMemo(() => {
    return sortedSectorOccupations
      ?.filter((so) => !!so.occupation)
      ?.map((so) => so.occupation) as Occupation[];
  }, [sortedSectorOccupations]);

  return (
    <Link
      href={{
        pathname: `/backoffice/profile/[userId]`,
        query: { userId },
      }}
      passHref
      onClick={() => {
        gaEvent(GA_TAGS.PAGE_ANNUAIRE_CARTE_CLIC);
      }}
    >
      <a target="_blank">
        <StyledProfileCard className="profile-card">
          <StyledProfileCardPictureContainer>
            <StyledProfileCardPicture>
              {urlImg ? (
                <Img
                  src={urlImg}
                  alt={`photo de ${firstName}`}
                  cover
                  onError={fallbackToCVImage}
                />
              ) : (
                <Img
                  src="/static/img/profile-placeholder.png"
                  alt={`photo de ${firstName}`}
                  cover
                  onError={fallbackToCVImage}
                />
              )}
              <Img src="/static/img/gradient.png" alt="" cover />
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
              {(USER_ROLES.CANDIDATE === role || USER_ROLES.COACH === role) && (
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
              <StyledProfileCardLabel>
                <Text color="darkGray">{labels.businessSectors}</Text>{' '}
              </StyledProfileCardLabel>
              <StyledProfileCardBusinessSectors>
                {sortedBusinessSectors && sortedBusinessSectors.length > 0 ? (
                  <>
                    {sortedBusinessSectors.slice(0, 2).map(({ id, name }) => {
                      return <Tag key={id} content={name} />;
                    })}
                    {role !== USER_ROLES.CANDIDATE &&
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
            {displayHelps ? (
              <StyledProfileCardHelpContainer>
                <StyledProfileCardLabel>
                  <Text color="darkGray">{labels.helps}</Text>
                </StyledProfileCardLabel>
                <StyledProfileCardHelps>
                  {helps && helps.length > 0 ? (
                    helps.map(({ name }) => {
                      const help = findConstantFromValue(name, ProfileHelps);
                      return (
                        <StyledProfileCardHelp key={help.value}>
                          {help.icon}
                          <StyledProfileCardHelpLabel>
                            {help.label}
                          </StyledProfileCardHelpLabel>
                        </StyledProfileCardHelp>
                      );
                    })
                  ) : (
                    <StyledProfileCardEmptyHelpsContainer>
                      <StyledProfileCardEmptyIcon>
                        <HandsIcon {...iconSizeProps} />
                      </StyledProfileCardEmptyIcon>
                      <Text color="mediumGray" size="small" variant="italic">
                        {EMPTY_INFO}
                      </Text>
                    </StyledProfileCardEmptyHelpsContainer>
                  )}
                </StyledProfileCardHelps>
              </StyledProfileCardHelpContainer>
            ) : (
              <StyledCTAContainer>
                <Button style="custom-primary-inverted">Voir le profil</Button>
              </StyledCTAContainer>
            )}
          </StyledProfileCardContent>
        </StyledProfileCard>
      </a>
    </Link>
  );
}
