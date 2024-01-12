import _ from 'lodash';
import React, { useMemo } from 'react';
import HandsIcon from 'assets/icons/illu-coeur-mains-ouvertes.svg';
import CaseIcon from 'assets/icons/illu-malette.svg';
import { HelpNames, UserCandidateWithUsers } from 'src/api/types';
import { H2, H3, H4 } from 'src/components/utils/Headings';
import { Img } from 'src/components/utils/Img';
import { Tag } from 'src/components/utils/Tag';
import { BUSINESS_LINES, BusinessLineValue } from 'src/constants';
import { Department } from 'src/constants/departements';
import { ProfileCardHelps } from 'src/constants/helps';
import { COLORS } from 'src/constants/styles';
import {
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  UserRole,
} from 'src/constants/users';
import { useImageFallback } from 'src/hooks/useImageFallback';
import { findConstantFromValue, isRoleIncluded, sortByOrder } from 'src/utils';
import { Card } from './Card';
import {
  StyledProfileCard,
  StyledProfileCardBusinessLines,
  StyledProfileCardContent,
  StyledProfileCardDepartment,
  StyledProfileCardEmptyContainer,
  StyledProfileCardEmptyIcon,
  StyledProfileCardEmptyJobContainer,
  StyledProfileCardEmptyLabel,
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
  department: Department;
  job?: string;
}

const getLabelsDependingOnRole = (role) => {
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
    <StyledProfileCard>
      <Card
        onClick={() => {
          /* TODO */
        }}
      >
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
          </StyledProfileCardPicture>
          <StyledProfileCardInfoContainer>
            <StyledProfileCardName>
              <H2
                color={COLORS.white}
                title={`${firstName} ${lastName.charAt(0)}.`}
              />
            </StyledProfileCardName>
            <StyledProfileCardDepartment>
              - {department}
            </StyledProfileCardDepartment>
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
                      <H3
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
                    <H4 color={COLORS.black} title={EMPTY_JOB} />
                  </StyledProfileCardEmptyJobContainer>
                )}
              </>
            )}
            {isRoleIncluded(COACH_USER_ROLES, role) && (
              <>
                {job ? (
                  <StyledProfileCardJobContainer>
                    <H3 color={COLORS.black} title={_.capitalize(job)} />
                  </StyledProfileCardJobContainer>
                ) : (
                  <StyledProfileCardEmptyJobContainer>
                    <H4 color={COLORS.black} title={EMPTY_JOB} />
                  </StyledProfileCardEmptyJobContainer>
                )}
              </>
            )}
            <StyledProfileCardLabel>
              {labels.businessLines}
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
                <StyledProfileCardEmptyContainer>
                  <StyledProfileCardEmptyIcon>
                    <CaseIcon />
                  </StyledProfileCardEmptyIcon>
                  <StyledProfileCardEmptyLabel>
                    {EMPTY_INFO}
                  </StyledProfileCardEmptyLabel>
                </StyledProfileCardEmptyContainer>
              )}
            </StyledProfileCardBusinessLines>
          </StyledProfileCardProfessionalSituation>

          <StyledProfileCardHelpContainer>
            <StyledSeparator />
            <StyledProfileCardLabel>{labels.helps}</StyledProfileCardLabel>
            <StyledProfileCardHelps>
              {helps && helps.length > 0 ? (
                helps.map(({ name }) => {
                  const help = findConstantFromValue(name, ProfileCardHelps);
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
                <StyledProfileCardEmptyContainer>
                  <StyledProfileCardEmptyIcon>
                    <HandsIcon />
                  </StyledProfileCardEmptyIcon>
                  <StyledProfileCardEmptyLabel>
                    {EMPTY_INFO}
                  </StyledProfileCardEmptyLabel>
                </StyledProfileCardEmptyContainer>
              )}
            </StyledProfileCardHelps>
          </StyledProfileCardHelpContainer>
        </StyledProfileCardContent>
      </Card>
    </StyledProfileCard>
  );
}
