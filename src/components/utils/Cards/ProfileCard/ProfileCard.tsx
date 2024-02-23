import _ from 'lodash';
import Link from 'next/link';
import React, { useMemo } from 'react';
import HandsIcon from 'assets/icons/illu-coeur-mains-ouvertes.svg';
import CaseIcon from 'assets/icons/illu-malette.svg';
import { UserCandidateWithUsers } from 'src/api/types';
import { AvailabilityTag } from 'src/components/utils/AvailabilityTag';
import { H3, H5 } from 'src/components/utils/Headings';
import { Img } from 'src/components/utils/Img';
import { Label } from 'src/components/utils/Label';
import { Tag } from 'src/components/utils/Tag';
import { BUSINESS_LINES, BusinessLineValue } from 'src/constants';
import { Department } from 'src/constants/departements';
import { HelpNames, ProfileHelps } from 'src/constants/helps';
import { COLORS } from 'src/constants/styles';
import { GA_TAGS } from 'src/constants/tags';
import {
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  UserRole,
} from 'src/constants/users';
import { useImageFallback } from 'src/hooks/useImageFallback';
import { gaEvent } from 'src/lib/gtag';
import { findConstantFromValue, isRoleIncluded, sortByOrder } from 'src/utils';
import {
  StyledProfileCard,
  StyledProfileCardAvailability,
  StyledProfileCardBusinessLines,
  StyledProfileCardContent,
  StyledProfileCardDepartment,
  StyledProfileCardEmptyBusinessLinesContainer,
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

interface ProfileCardProps {
  userId: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  helps?: {
    name: HelpNames;
  }[];
  businessLines?: {
    name: BusinessLineValue;
    order: number;
  }[];
  ambitions?: {
    name: string;
    order: number;
  }[];
  userCandidate?: UserCandidateWithUsers;
  department?: Department;
  job?: string;
  isAvailable: boolean;
}

const getLabelsDependingOnRole = (role: UserRole) => {
  if (isRoleIncluded(CANDIDATE_USER_ROLES, role)) {
    return {
      businessLines: 'Je recherche un emploi dans\xa0:',
      helps: "Je souhaite avoir de l'aide dans\xa0:",
      role: 'Candidat',
    };
  }
  if (isRoleIncluded(COACH_USER_ROLES, role)) {
    return {
      businessLines: "J'ai du réseau dans\xa0:",
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
  businessLines,
  ambitions,
  userCandidate,
  job,
  isAvailable,
}: ProfileCardProps) {
  const { urlImg, fallbackToCVImage } = useImageFallback({
    userId,
    role,
    userCandidate,
  });

  const labels = useMemo(() => getLabelsDependingOnRole(role), [role]);

  const sortedBusinessLines =
    businessLines && businessLines.length > 0
      ? sortByOrder(businessLines)
      : null;

  const sortedAmbitions =
    ambitions && ambitions.length > 0 ? sortByOrder(ambitions) : null;

  return (
    <Link
      href={{
        pathname: `/backoffice/profile/[userId]`,
        query: { userId },
      }}
      onClick={() => {
        gaEvent(GA_TAGS.PAGE_ANNUAIRE_CARTE_CLIC);
      }}
    >
      <StyledProfileCard>
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
                <Label>{department}</Label>
              </StyledProfileCardDepartment>
            )}
          </StyledProfileCardInfoContainer>
          <StyledProfileCardRole>
            <Tag content={labels.role} style="secondary" />
          </StyledProfileCardRole>
        </StyledProfileCardPictureContainer>
        <StyledProfileCardContent>
          <StyledProfileCardProfessionalSituation>
            {isRoleIncluded(CANDIDATE_USER_ROLES, role) && (
              <>
                {sortedAmbitions && sortedAmbitions.length > 0 ? (
                  <StyledProfileCardJobContainer>
                    {sortedAmbitions.map(({ name }, index) => (
                      <H5
                        key={name}
                        color={COLORS.black}
                        title={`${_.capitalize(name)}${
                          index < sortedAmbitions.length - 1 ? ',\xa0' : ''
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
            {isRoleIncluded(COACH_USER_ROLES, role) && (
              <>
                {job ? (
                  <StyledProfileCardJobContainer>
                    <H5 color={COLORS.black} title={_.capitalize(job)} />
                  </StyledProfileCardJobContainer>
                ) : (
                  <StyledProfileCardEmptyJobContainer>
                    <H5 color={COLORS.black} title={EMPTY_JOB} />
                  </StyledProfileCardEmptyJobContainer>
                )}
              </>
            )}
            <StyledProfileCardLabel>
              <Label color="light">{labels.businessLines}</Label>{' '}
            </StyledProfileCardLabel>
            <StyledProfileCardBusinessLines>
              {sortedBusinessLines && sortedBusinessLines.length > 0 ? (
                <>
                  {sortedBusinessLines.slice(0, 2).map(({ name }) => {
                    const businessLine = findConstantFromValue(
                      name,
                      BUSINESS_LINES
                    );
                    return (
                      <Tag
                        key={businessLine.value}
                        content={businessLine.label}
                      />
                    );
                  })}
                  {!isRoleIncluded(CANDIDATE_USER_ROLES, role) &&
                    sortedBusinessLines.length > 2 && (
                      <Tag content={`+${sortedBusinessLines.length - 2}`} />
                    )}
                </>
              ) : (
                <StyledProfileCardEmptyBusinessLinesContainer>
                  <StyledProfileCardEmptyIcon>
                    <CaseIcon {...iconSizeProps} />
                  </StyledProfileCardEmptyIcon>
                  <Label color="lighter" size="small" variant="italic">
                    {EMPTY_INFO}
                  </Label>
                </StyledProfileCardEmptyBusinessLinesContainer>
              )}
            </StyledProfileCardBusinessLines>
          </StyledProfileCardProfessionalSituation>

          <StyledProfileCardHelpContainer>
            <StyledSeparator />
            <StyledProfileCardLabel>
              <Label color="light">{labels.helps}</Label>
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
                  <Label color="lighter" size="small" variant="italic">
                    {EMPTY_INFO}
                  </Label>
                </StyledProfileCardEmptyHelpsContainer>
              )}
            </StyledProfileCardHelps>
          </StyledProfileCardHelpContainer>
        </StyledProfileCardContent>
      </StyledProfileCard>
    </Link>
  );
}
