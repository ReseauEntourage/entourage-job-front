import React from 'react';
import { useSelector } from 'react-redux';
import { CVPreferences } from '../CVPreferences';
import { Card, SimpleLink } from 'src/components/utils';
import { H5 } from 'src/components/utils/Headings';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { COACH_USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { selectLinkedUser } from 'src/use-cases/current-user';
import { isRoleIncluded, getUserCandidateFromCoach } from 'src/utils/Finding';
import { StyledInformationsPersonnellesList } from './UserInformationCard.styles';

export const LinkedUserInformationCard = ({
  isAdmin = false,
}: {
  isAdmin?: boolean;
}) => {
  const user = useAuthenticatedUser();
  const linkedUser = useSelector(selectLinkedUser);

  if (!linkedUser) {
    return (
      <Card
        title={`Information du${
          isRoleIncluded(COACH_USER_ROLES, user.role) ? ' candidat' : ' coach'
        }`}
      >
        Aucun membre lié
      </Card>
    );
  }
  const userCandidat = getUserCandidateFromCoach(user, linkedUser.id);

  // si membre lié ou non
  const cardContent = (
    <>
      <StyledInformationsPersonnellesList>
        <li>
          <LucidIcon name="User" />
          <span>{`${linkedUser.firstName} ${linkedUser.lastName}`}</span>
        </li>
        {!linkedUser.deletedAt && (
          <>
            <li>
              <SimpleLink
                href={`mailto:${linkedUser.email}`}
                isExternal
                target="_blank"
              >
                <LucidIcon name="MessageCircle" />
                <span data-testid="linkeduser-email-span">
                  {linkedUser.email}
                </span>
              </SimpleLink>
            </li>
            {linkedUser.phone ? (
              <li>
                <SimpleLink href={`tel:${linkedUser.phone}`} isExternal>
                  <LucidIcon name="Phone" /> <span>{linkedUser.phone}</span>
                </SimpleLink>
              </li>
            ) : (
              <li>
                <LucidIcon name="Phone" />
                <span className="uk-text-italic">
                  Numéro de téléphone non renseigné
                </span>
              </li>
            )}
            {isRoleIncluded(COACH_USER_ROLES, user.role) &&
              (linkedUser.address ? (
                <li>
                  <LucidIcon name="House" /> <span>{linkedUser.address}</span>
                </li>
              ) : (
                <li>
                  <LucidIcon name="House" />{' '}
                  <span className="uk-text-italic">
                    Adresse postale non renseignée
                  </span>
                </li>
              ))}
            {isRoleIncluded(COACH_USER_ROLES, user.role) && userCandidat && (
              <SimpleLink
                className="uk-link-muted"
                target="_blank"
                href={`/cv/${userCandidat.url}`}
              >
                <li>
                  <LucidIcon name="Link" />
                  <span className="uk-text-italic">{userCandidat.url}</span>
                </li>
              </SimpleLink>
            )}
          </>
        )}
      </StyledInformationsPersonnellesList>
      {!isAdmin &&
        isRoleIncluded(COACH_USER_ROLES, user.role) &&
        userCandidat &&
        !linkedUser.deletedAt && (
          <StyledInformationsPersonnellesList>
            <li>
              <H5 color="primaryBlue" title="Informations sur le CV" />
            </li>
            <CVPreferences
              userRole={user.role}
              candidatId={linkedUser.id}
              candidat={userCandidat}
            />
          </StyledInformationsPersonnellesList>
        )}
    </>
  );

  return (
    <Card
      title={`Information du${
        isRoleIncluded(COACH_USER_ROLES, user.role) ? ' candidat' : ' coach'
      }`}
      key={linkedUser.id}
      isMobileClosable
    >
      {cardContent}
    </Card>
  );
};
