import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import UIkit from 'uikit';
import EmailIcon from 'assets/icons/email.svg';
import HomeIcon from 'assets/icons/home.svg';
import LinkIcon from 'assets/icons/link.svg';
import PhoneIcon from 'assets/icons/phone.svg';
import UserIcon from 'assets/icons/user.svg';
import { Api } from 'src/api';
import { UserWithUserCandidate } from 'src/api/types';
import { ToggleWithConfirmationModal } from 'src/components/backoffice/ToggleWithConfirmationModal';
import { CandidateEmployedToggle } from 'src/components/backoffice/candidate/CandidateEmployedToggle';
import { ContractLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel/ContractLabel';
import { Card, SimpleLink } from 'src/components/utils';
import { H5 } from 'src/components/utils/Headings';
import { CANDIDATE_USER_ROLES, COACH_USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { authenticationActions } from 'src/use-cases/authentication';
import {
  getRelatedUser,
  isRoleIncluded,
  getUserCandidateFromCoach,
} from 'src/utils/Finding';
import { StyledInformationsPersonnelles } from './UserInformationCard.styles';

export const LinkedUserInformationCard = ({
  isAdmin = false,
}: {
  isAdmin?: boolean;
}) => {
  const user = useAuthenticatedUser();

  const [linkedUser, setLinkedUser] = useState<UserWithUserCandidate[]>();

  const dispatch = useDispatch();

  const assignUser = useCallback((userToAssign) => {
    if (isRoleIncluded(COACH_USER_ROLES, userToAssign.role)) {
      const candidat: UserWithUserCandidate | UserWithUserCandidate[] =
        getRelatedUser(userToAssign);
      if (candidat) {
        setLinkedUser(candidat);
      } else {
        setLinkedUser(
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          null
        );
      }
    }
    if (isRoleIncluded(CANDIDATE_USER_ROLES, userToAssign.role)) {
      const coach = getRelatedUser(userToAssign);
      if (coach) {
        setLinkedUser(coach);
      } else {
        setLinkedUser(
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          null
        );
      }
    }
  }, []);

  const updateUserCandidate = useCallback(
    (id, props) => {
      if (!('coaches' in user) || !user.coaches) return null;
      const newCoachesArray = user.coaches.map((obj) =>
        obj.candidat?.id === id ? props : obj
      );
      dispatch(
        authenticationActions.setUser({
          ...user,
          coaches: newCoachesArray,
        })
      );
    },
    [dispatch, user]
  );

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
            <StyledInformationsPersonnelles>
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
            </StyledInformationsPersonnelles>
            {!isAdmin &&
              isRoleIncluded(COACH_USER_ROLES, user.role) &&
              !singleLinkedUser.deletedAt && (
                <StyledInformationsPersonnelles>
                  <li>
                    <H5 color="primaryOrange" title="Informations sur le CV" />
                  </li>
                  <li>
                    <CandidateEmployedToggle
                      title="A retrouvé un emploi"
                      modalTitle="Le candidat a retrouvé un emploi ?"
                      modalConfirmation="Valider"
                      defaultValue={userCandidat.employed}
                      notificationMessage="Le profil du candidat a été mis à jour !"
                      subtitle={
                        userCandidat && (
                          <ContractLabel
                            contract={userCandidat.contract}
                            endOfContract={userCandidat.endOfContract}
                          />
                        )
                      }
                      setData={(newData) => {
                        updateUserCandidate(singleLinkedUser.id, {
                          ...userCandidat,
                          ...newData,
                        });
                      }}
                      candidateId={singleLinkedUser.id}
                    />
                  </li>
                  <li>
                    <ToggleWithConfirmationModal
                      id="hiddenToggle"
                      title="Masquer le CV"
                      modalTitle="Changer la visibilité du CV en ligne ?"
                      modalConfirmation="Oui, masquer le CV"
                      defaultValue={userCandidat.hidden}
                      onToggle={(hidden) => {
                        return Api.putCandidate(singleLinkedUser.id, {
                          hidden,
                        })
                          .then(() => {
                            updateUserCandidate(singleLinkedUser.id, {
                              ...userCandidat,
                              hidden,
                            });
                            UIkit.notification(
                              hidden
                                ? 'Le CV est désormais masqué'
                                : 'Le CV est désormais visible',
                              'success'
                            );
                          })
                          .catch(() => {
                            return UIkit.notification(
                              'Une erreur est survenue lors du masquage du profil',
                              'danger'
                            );
                          });
                      }}
                    />
                  </li>
                </StyledInformationsPersonnelles>
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
            isMobileClosable
          >
            {cardContent}
          </Card>
        );
      })}
    </>
  );
};
