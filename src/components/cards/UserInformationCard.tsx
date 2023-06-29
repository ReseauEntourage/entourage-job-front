import React, { useCallback, useEffect, useState } from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { UserWithUserCandidate } from 'src/api/types';
import { ToggleWithConfirmationModal } from 'src/components/backoffice/ToggleWithConfirmationModal';
import { CandidateEmployedToggle } from 'src/components/backoffice/candidate/CandidateEmployedToggle';
import { ContractLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel/ContractLabel';
import { Card, Grid, SimpleLink, Icon } from 'src/components/utils';
import { CANDIDATE_USER_ROLES, COACH_USER_ROLES } from 'src/constants/users';
import {
  getRelatedUser,
  isRoleIncluded,
  getUserCandidateFromCoach,
} from 'src/utils/Finding';

export const UserInformationCard = ({
  isAdmin = false,
  user,
}: {
  isAdmin?: boolean;
  user: UserWithUserCandidate;
}) => {
  const [linkedUser, setLinkedUser] = useState<UserWithUserCandidate[]>();

  const assignUser = useCallback((userToAssign) => {
    if (isRoleIncluded(COACH_USER_ROLES, userToAssign.role)) {
      const candidat: UserWithUserCandidate | UserWithUserCandidate[] =
        getRelatedUser(userToAssign);
      if (candidat) {
        setLinkedUser(candidat);
      } else {
        setLinkedUser(null);
      }
    }
    if (isRoleIncluded(CANDIDATE_USER_ROLES, userToAssign.role)) {
      const coach = getRelatedUser(userToAssign);
      if (coach) {
        setLinkedUser(coach);
      } else {
        setLinkedUser(null);
      }
    }
  }, []);

  const updateUserCandidate = useCallback((id, props) => {
    setLinkedUser((prevLinkedUser): UserWithUserCandidate[] => {
      const index = prevLinkedUser.findIndex((prevSingleLinkedUser) => {
        return prevSingleLinkedUser.id === id;
      });

      const newLinkedUser = [...prevLinkedUser];

      newLinkedUser[index] = {
        ...newLinkedUser[index],
        candidat: props,
      };

      return newLinkedUser;
    });
  }, []);

  useEffect(() => {
    if (user) {
      assignUser(user);
    }
  }, [assignUser, user]);

  if (!linkedUser) {
    return (
      <Card
        style="secondary"
        title={`Information du${
          isRoleIncluded(COACH_USER_ROLES, user.role) ? ' candidat' : ' coach'
        }`}
      >
        <Grid column gap="small">
          <span className="uk-text-italic">Aucun membre lié</span>
        </Grid>
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
          <Grid column gap="small">
            <Grid row gap="small">
              <Icon name="user" />
              <span>{`${singleLinkedUser.firstName} ${singleLinkedUser.lastName}`}</span>
            </Grid>
            {!singleLinkedUser.deletedAt && (
              <Grid column gap="small">
                <SimpleLink
                  href={`mailto:${singleLinkedUser.email}`}
                  className="uk-link-muted"
                  isExternal
                  target="_blank"
                >
                  <Grid row gap="small">
                    <Icon name="mail" />
                    <span data-testid="linkeduser-email-span">
                      {singleLinkedUser.email}
                    </span>
                  </Grid>
                </SimpleLink>
                {singleLinkedUser.phone ? (
                  <SimpleLink
                    href={`tel:${singleLinkedUser.phone}`}
                    className="uk-link-muted"
                    isExternal
                  >
                    <Grid row gap="small">
                      <Icon name="phone" />
                      <span>{singleLinkedUser.phone}</span>
                    </Grid>
                  </SimpleLink>
                ) : (
                  <Grid row gap="small">
                    <Icon name="phone" />
                    <span className="uk-text-italic">
                      Numéro de téléphone non renseigné
                    </span>
                  </Grid>
                )}
                {isRoleIncluded(COACH_USER_ROLES, user.role) &&
                  (singleLinkedUser.address ? (
                    <Grid row gap="small">
                      <Icon name="home" />
                      <span>{singleLinkedUser.address}</span>
                    </Grid>
                  ) : (
                    <Grid row gap="small">
                      <Icon name="home" />
                      <span className="uk-text-italic">
                        Adresse postale non renseignée
                      </span>
                    </Grid>
                  ))}
                {isRoleIncluded(COACH_USER_ROLES, user.role) &&
                  userCandidat && (
                    <SimpleLink
                      className="uk-link-muted"
                      target="_blank"
                      href={`/cv/${userCandidat.url}`}
                    >
                      <Grid row gap="small">
                        <Icon name="link" />
                        <span className="uk-text-italic">
                          {userCandidat.url}
                        </span>
                      </Grid>
                    </SimpleLink>
                  )}
              </Grid>
            )}
          </Grid>
        );

        return (
          <Grid
            gap={
              isRoleIncluded(COACH_USER_ROLES, user.role)
                ? 'medium'
                : 'collapse'
            }
            childWidths={['1-1']}
          >
            {!isAdmin &&
              isRoleIncluded(COACH_USER_ROLES, user.role) &&
              !singleLinkedUser.deletedAt && (
                <Card style="secondary" title="Préférences du CV">
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
                </Card>
              )}
            <Card
              style="secondary"
              title={`Information du${
                isRoleIncluded(COACH_USER_ROLES, user.role)
                  ? ' candidat'
                  : ' coach'
              }`}
            >
              {cardContent}
            </Card>
          </Grid>
        );
      })}
    </>
  );
};
