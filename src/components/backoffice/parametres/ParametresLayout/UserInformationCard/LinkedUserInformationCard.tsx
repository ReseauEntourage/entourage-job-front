import React, { useCallback, useEffect, useState } from 'react';
import EmailIcon from 'assets/icons/email.svg';
import HomeIcon from 'assets/icons/home.svg';
import LinkIcon from 'assets/icons/link.svg';
import PhoneIcon from 'assets/icons/phone.svg';
import UserIcon from 'assets/icons/user.svg';
import { CVPreferences } from '../CVPreferences';
import { UserWithUserCandidate } from 'src/api/types';
import { Card, SimpleLink } from 'src/components/utils';
import { H5 } from 'src/components/utils/Headings';
import { CANDIDATE_USER_ROLES, COACH_USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import {
  getRelatedUser,
  isRoleIncluded,
  getUserCandidateFromCoach,
} from 'src/utils/Finding';
import { StyledInformationsPersonnellesList } from './UserInformationCard.styles';

export const LinkedUserInformationCard = ({
  isAdmin = false,
}: {
  isAdmin?: boolean;
}) => {
  const user = useAuthenticatedUser();

  const [linkedUser, setLinkedUser] = useState<UserWithUserCandidate[]>();

  const assignUser = useCallback((userToAssign) => {
    if (isRoleIncluded(COACH_USER_ROLES, userToAssign.role)) {
      const candidat: UserWithUserCandidate | UserWithUserCandidate[] =
        getRelatedUser(userToAssign);
      if (candidat) {
        setLinkedUser(candidat);
      } else {
        setLinkedUser(undefined);
      }
    }
    if (isRoleIncluded(CANDIDATE_USER_ROLES, userToAssign.role)) {
      const coach = getRelatedUser(userToAssign);
      if (coach) {
        setLinkedUser(coach);
      } else {
        setLinkedUser(undefined);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      assignUser(user);
    }
  }, [assignUser, user]);

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

  return (
    <>
      {linkedUser.map((singleLinkedUser) => {
        const userCandidat = getUserCandidateFromCoach(
          user,
          singleLinkedUser.id
        );

        // si membre lié ou non
        const cardContent = (
          <>
            <StyledInformationsPersonnellesList>
              <li>
                <UserIcon />
                <span>{`${singleLinkedUser.firstName} ${singleLinkedUser.lastName}`}</span>
              </li>
              {!singleLinkedUser.deletedAt && (
                <>
                  <li>
                    <SimpleLink
                      href={`mailto:${singleLinkedUser.email}`}
                      className="uk-link-muted"
                      isExternal
                      target="_blank"
                    >
                      <EmailIcon />
                      <span data-testid="linkeduser-email-span">
                        {singleLinkedUser.email}
                      </span>
                    </SimpleLink>
                  </li>
                  {singleLinkedUser.phone ? (
                    <SimpleLink
                      href={`tel:${singleLinkedUser.phone}`}
                      className="uk-link-muted"
                      isExternal
                    >
                      <li>
                        <PhoneIcon /> <span>{singleLinkedUser.phone}</span>
                      </li>
                    </SimpleLink>
                  ) : (
                    <li>
                      <PhoneIcon />
                      <span className="uk-text-italic">
                        Numéro de téléphone non renseigné
                      </span>
                    </li>
                  )}
                  {isRoleIncluded(COACH_USER_ROLES, user.role) &&
                    (singleLinkedUser.address ? (
                      <li>
                        <HomeIcon /> <span>{singleLinkedUser.address}</span>
                      </li>
                    ) : (
                      <li>
                        <HomeIcon />{' '}
                        <span className="uk-text-italic">
                          Adresse postale non renseignée
                        </span>
                      </li>
                    ))}
                  {isRoleIncluded(COACH_USER_ROLES, user.role) &&
                    userCandidat && (
                      <SimpleLink
                        className="uk-link-muted"
                        target="_blank"
                        href={`/cv/${userCandidat.url}`}
                      >
                        <li>
                          <LinkIcon width={20} height={20} />
                          <span className="uk-text-italic">
                            {userCandidat.url}
                          </span>
                        </li>
                      </SimpleLink>
                    )}
                </>
              )}
            </StyledInformationsPersonnellesList>
            {!isAdmin &&
              isRoleIncluded(COACH_USER_ROLES, user.role) &&
              !singleLinkedUser.deletedAt && (
                <StyledInformationsPersonnellesList>
                  <li>
                    <H5 color="primaryOrange" title="Informations sur le CV" />
                  </li>
                  <CVPreferences
                    userRole={user.role}
                    candidatId={singleLinkedUser.id}
                    candidat={userCandidat}
                  />
                </StyledInformationsPersonnellesList>
              )}
          </>
        );

        return (
          <Card
            title={`Information du${
              isRoleIncluded(COACH_USER_ROLES, user.role)
                ? ' candidat'
                : ' coach'
            }`}
            key={singleLinkedUser.id}
            isMobileClosable
          >
            {cardContent}
          </Card>
        );
      })}
    </>
  );
};
