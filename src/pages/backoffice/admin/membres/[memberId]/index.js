import UIkit from 'uikit';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { usePrevious } from 'src/hooks/utils';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import Api from 'src/Axios';
import { Button, Card, Grid, Section, SimpleLink } from 'src/components/utils';
import schemaEditUser from 'src/components/forms/schema/formEditUser';
import schemaDeleteUser from 'src/components/forms/schema/formDeleteUser.json';
import CVPageContent from 'src/components/backoffice/cv/CVPageContent';
import CandidatHeader from 'src/components/backoffice/cv/CandidatHeader';
import UserInformationCard from 'src/components/cards/UserInformationCard';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import ModalEdit from 'src/components/modals/ModalEdit';
import { OFFER_ADMIN_FILTERS_DATA, USER_ROLES } from 'src/constants';
import ToggleWithConfirmationModal from 'src/components/backoffice/ToggleWithConfirmationModal';
import {
  getCandidateFromCoachOrCandidate,
  getCandidateIdFromCoachOrCandidate,
  mutateFormSchema,
} from 'src/utils';
import AdminCandidateOpportunities from 'src/components/opportunities/AdminCandidateOpportunities';
import CandidateEmployedToggle from 'src/components/backoffice/candidate/CandidateEmployedToggle';
import ContractLabel from 'src/components/backoffice/candidate/ContractLabel';
import { IconNoSSR } from 'src/components/utils/Icon';
import PropTypes from 'prop-types';
import { openModal } from 'src/components/modals/Modal';
import ModalConfirm from 'src/components/modals/ModalConfirm';
import ErrorMessage from 'src/components/backoffice/cv/ErrorMessage';
import { useFetchCV } from 'src/hooks/useFetchCV';
import _ from 'lodash';
import { gaEvent } from 'src/lib/gtag';
import { GA_TAGS } from 'src/constants/tags';

const EditUserModal = ({ user, setUser }) => {
  let mutatedSchema = mutateFormSchema(schemaEditUser, [
    {
      fieldId: 'userToCoach',
      props: [
        {
          propName: 'disabled',
          value: true,
        },
        {
          propName: 'hidden',
          value: true,
        },
      ],
    },
    {
      fieldId: 'role',
      props: [
        {
          propName: 'hidden',
          value: true,
          option: USER_ROLES.ADMIN,
        },
      ],
    },
    {
      fieldId: 'adminRole',
      props: [
        {
          propName: 'hidden',
          value: true,
        },
        {
          propName: 'disabled',
          value: true,
        },
      ],
    },
  ]);

  if (user) {
    if (user.role !== USER_ROLES.CANDIDAT) {
      mutatedSchema = mutateFormSchema(mutatedSchema, [
        {
          fieldId: 'address',
          props: [
            {
              propName: 'disabled',
              value: true,
            },
            {
              propName: 'hidden',
              value: true,
            },
          ],
        },
        {
          fieldId: 'addressLabel',
          props: [
            {
              propName: 'disabled',
              value: true,
            },
            {
              propName: 'hidden',
              value: true,
            },
          ],
        },
      ]);
    }
    if (user.role === USER_ROLES.ADMIN) {
      mutatedSchema = mutateFormSchema(mutatedSchema, [
        {
          fieldId: 'phone',
          props: [
            {
              propName: 'disabled',
              value: true,
            },
            {
              propName: 'hidden',
              value: true,
            },
          ],
        },
        {
          fieldId: 'phoneLabel',
          props: [
            {
              propName: 'disabled',
              value: true,
            },
            {
              propName: 'hidden',
              value: true,
            },
          ],
        },
      ]);
    }
  }

  return (
    <ModalEdit
      formSchema={mutatedSchema}
      title="Edition d'un membre"
      description="Merci de modifier les informations que vous souhaitez concernant le membre."
      submitText="Modifier le membre"
      defaultValues={{
        ...user,
        gender: user.gender.toString(),
      }}
      onSubmit={async (fields, closeModal) => {
        const updateUser = async (onError) => {
          try {
            const { data } = await Api.put(`/user/${user.id}`, {
              ...fields,
              email: fields.email.toLowerCase(),
              firstName: fields.firstName.trim().replace(/\s\s+/g, ' '),
              lastName: fields.lastName.trim().replace(/\s\s+/g, ' '),
            });
            if (data) {
              closeModal();
              UIkit.notification('Le membre a bien ??t?? modifi??', 'success');
              setUser(data);
            } else {
              throw new Error('r??ponse de la requete vide');
            }
          } catch (error) {
            console.error(error);
            if (onError) onError();
            if (error.response.status === 409) {
              UIkit.notification(
                'Cette adresse email est d??j?? utilis??e',
                'danger'
              );
            } else {
              UIkit.notification(
                "Une erreur s'est produite lors de la modification du membre",
                'danger'
              );
            }
          }
        };

        if (fields.role !== user.role) {
          openModal(
            <ModalConfirm
              text="Attention, si vous modifiez le r??le d'un candidat, tout son suivi sera perdu et son CV sera d??publi??. ??tes-vous s??r de vouloir continuer ?"
              buttonText="Valider"
              onConfirm={async () => {
                await updateUser(() => {
                  openModal(<EditUserModal user={user} setUser={setUser} />);
                });
              }}
            />
          );
        } else {
          await updateUser();
        }
      }}
    />
  );
};

EditUserModal.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.oneOf([
      USER_ROLES.COACH,
      USER_ROLES.ADMIN,
      USER_ROLES.CANDIDAT,
    ]).isRequired,
    gender: PropTypes.number.isRequired,
    ...PropTypes.shape(),
  }).isRequired,
  setUser: PropTypes.func.isRequired,
};

const User = () => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const {
    isReady,
    replace,
    query: { memberId, tab, offerId },
  } = useRouter();

  useEffect(() => {
    if (isReady) {
      if (memberId && !tab) {
        replace(`/backoffice/admin/membres/${memberId}/cv`, undefined, {
          shallow: true,
        });
      } else if (offerId && tab !== 'offres') {
        replace(`/backoffice/admin/membres/${memberId}/${tab}`, undefined, {
          shallow: true,
        });
      }
    }
  }, [isReady, memberId, offerId, replace, tab]);

  const prevId = usePrevious(memberId);

  const getUser = useCallback(() => {
    Api.get(`/user/${memberId}`)
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [memberId]);

  useEffect(() => {
    if (memberId !== prevId) {
      getUser();
    } else if (tab === 'parametres') {
      getUser();
    }
  }, [tab, getUser, memberId, prevId]);

  const { cv, setCV, error, loading: cvLoading } = useFetchCV(user);

  const deleteUser = async (fields, closeModal) => {
    try {
      if (fields.confirmation === 'SUPPRIMER') {
        await Api.delete(`/user/${memberId}`);
        closeModal();
        UIkit.notification("L'utilisateur a bien ??t?? supprim??", 'success');
        replace('/backoffice/admin/membres');
      } else {
        UIkit.notification('Erreur de confirmation', 'danger');
      }
    } catch {
      UIkit.notification('Une erreur est survenue', 'danger');
    }
  };

  const isCandidat = user && user.candidat && user.role === USER_ROLES.CANDIDAT;

  if (loading || cvLoading || !tab) {
    return (
      <LayoutBackOffice title="Chargement - Gestion des membres">
        <Section>
          <Grid column gap="large">
            <SimpleLink
              href="/backoffice/admin/membres"
              className="uk-link-reset uk-flex uk-flex-middle"
            >
              <IconNoSSR name="chevron-left" />
              Retour ?? la liste
            </SimpleLink>
            <div>
              <div data-uk-spinner="" />
              <hr className="ent-divier-backoffice" />
            </div>
          </Grid>
        </Section>
      </LayoutBackOffice>
    );
  }

  if (!user) {
    return (
      <LayoutBackOffice title="Page introuvable - Gestion des membres">
        <Section className="uk-text-center" size="large">
          <Grid column gap="large">
            <SimpleLink
              href="/backoffice/admin/membres"
              className="uk-link-reset uk-flex uk-flex-middle"
            >
              <IconNoSSR name="chevron-left" />
              Retour ?? la liste
            </SimpleLink>
            <div>
              <hr className="ent-divier-backoffice" />
              <h3 className="uk-text-bold">Ce profil n???est pas disponible</h3>
              <p>
                Le lien que vous avez suivi est peut-??tre rompu, ou la page a
                ??t?? supprim??e.
              </p>
            </div>
          </Grid>
        </Section>
      </LayoutBackOffice>
    );
  }

  // erreur pendant la requete
  if (error) {
    return (
      <LayoutBackOffice title="Erreur - Gestion des membres">
        <Section className="uk-text-center" size="large">
          <ErrorMessage error={error} />
        </Section>
      </LayoutBackOffice>
    );
  }

  return (
    <LayoutBackOffice title={`${user.firstName} - Gestion des membres`}>
      <Section>
        <Grid column gap="medium">
          <Grid between eachWidths={['expand@m', 'auto@m']}>
            <SimpleLink
              href={`/backoffice/admin/membres?role=${user.role}${
                user.zone ? `&zone=${user.zone}` : ''
              }`}
              className="uk-link-reset uk-flex uk-flex-middle"
            >
              <IconNoSSR name="chevron-left" />
              Retour ?? la liste
            </SimpleLink>
            {cv && (
              <Button
                style="default"
                href={{
                  pathname: '/backoffice/admin/offres',
                  query: {
                    tag: OFFER_ADMIN_FILTERS_DATA[1].tag,
                    department: cv.locations,
                    businessLines: _.uniq(
                      cv.businessLines.map(({ name }) => {
                        return name;
                      })
                    ),
                  },
                }}
                onClick={() => {
                  gaEvent(GA_TAGS.BACKOFFICE_ADMIN_OFFRES_INTERESSER_CLIC);
                }}
              >
                Voir les offres qui pourraient int??resser le candidat
                <IconNoSSR
                  name="chevron-right"
                  ratio="0.8"
                  className="uk-margin-small-left"
                />
              </Button>
            )}
          </Grid>
          <div>
            <CandidatHeader user={user} showZone />
            <hr className="ent-divier-backoffice uk-margin-medium-top" />
          </div>
          <ul className="uk-subnav">
            <li className={tab === 'cv' ? 'uk-active' : ''}>
              <SimpleLink href={`/backoffice/admin/membres/${memberId}/cv`}>
                CV
              </SimpleLink>
            </li>
            <li className={tab === 'offres' ? 'uk-active' : ''}>
              <SimpleLink href={`/backoffice/admin/membres/${memberId}/offres`}>
                Opportunit??s
              </SimpleLink>
            </li>
            <li className={tab === 'parametres' ? 'uk-active' : ''}>
              <SimpleLink
                href={`/backoffice/admin/membres/${memberId}/parametres`}
              >
                Param??tres
              </SimpleLink>
            </li>
          </ul>
          {tab !== 'parametres' && user.role === USER_ROLES.COACH && (
            <>
              {getCandidateFromCoachOrCandidate(user) ? (
                <div>
                  {tab === 'cv' && (
                    <CVPageContent
                      candidatId={getCandidateIdFromCoachOrCandidate(user)}
                      cv={cv}
                      setCV={setCV}
                    />
                  )}
                  {tab === 'offres' && (
                    <AdminCandidateOpportunities
                      candidatId={getCandidateIdFromCoachOrCandidate(user)}
                    />
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="uk-text-bold uk-text-center">
                    <span className="uk-text-primary">Aucun candidat</span>{' '}
                    n&apos;est rattach?? ?? ce compte coach.
                  </h2>
                  <p className="uk-text-center">
                    Il peut y avoir plusieurs raisons ?? ce sujet. Contacte
                    l&apos;??quipe LinkedOut pour en savoir plus.
                  </p>
                </div>
              )}
            </>
          )}
          {tab !== 'parametres' && user.role === USER_ROLES.CANDIDAT && (
            <div>
              {tab === 'cv' && (
                <CVPageContent candidatId={user.id} cv={cv} setCV={setCV} />
              )}
              {tab === 'offres' && (
                <AdminCandidateOpportunities candidatId={user.id} />
              )}
            </div>
          )}
          {tab === 'parametres' && (
            <Grid childWidths={['1-2@m']}>
              {(user.role === USER_ROLES.CANDIDAT ||
                user.role === USER_ROLES.COACH) && (
                /* TODO CHECK IF BUG COMES FROM HERE */
                <Grid
                  gap={isCandidat ? 'medium' : 'collapse'}
                  childWidths={['1-1']}
                >
                  <div>
                    {isCandidat && (
                      <Card title="Pr??f??rences du CV">
                        <CandidateEmployedToggle
                          title="A retrouv?? un emploi"
                          modalTitle="Le candidat a retrouv?? un emploi ?"
                          modalConfirmation="Valider"
                          defaultValue={user.candidat.employed}
                          notificationMessage="Le profil du candidat a ??t?? mis ?? jour !"
                          subtitle={
                            user &&
                            user.candidat && (
                              <ContractLabel
                                contract={user.candidat.contract}
                                endOfContract={user.candidat.endOfContract}
                              />
                            )
                          }
                          setData={(newData) => {
                            setUser({
                              ...user,
                              candidat: {
                                ...user.candidat,
                                ...newData,
                              },
                            });
                          }}
                          candidatId={user.id}
                        />
                        <ToggleWithConfirmationModal
                          id="hidden"
                          title="Masquer le CV"
                          modalTitle="Changer la visibilit?? du CV en ligne ?"
                          modalConfirmation="Oui, masquer le CV"
                          defaultValue={user.candidat.hidden}
                          onToggle={(hidden) => {
                            return Api.put(`/user/candidat/${user.id}`, {
                              hidden,
                            })
                              .then(() => {
                                setUser({
                                  ...user,
                                  candidat: {
                                    ...user.candidat,
                                    hidden,
                                  },
                                });
                                UIkit.notification(
                                  hidden
                                    ? 'Le CV est d??sormais masqu??'
                                    : 'Le CV est d??sormais visible',
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
                  </div>
                  <div className="uk-card uk-card-default uk-card-body">
                    <Grid gap="small" between eachWidths={['expand', 'auto']}>
                      <h3 className="uk-card-title">
                        Informations personnelles
                      </h3>
                      <ButtonIcon
                        name="pencil"
                        onClick={() => {
                          openModal(
                            <EditUserModal user={user} setUser={setUser} />
                          );
                        }}
                      />
                    </Grid>
                    {user ? (
                      <Grid column gap="small">
                        <Grid row gap="small" middle>
                          <IconNoSSR name="user" style={{ width: 20 }} />
                          <span>{`${user.firstName} ${user.lastName}`}</span>
                        </Grid>
                        <Grid row gap="small" middle>
                          <IconNoSSR name="gender" style={{ width: 20 }} />
                          <span>
                            {`${user.gender === 0 ? 'Homme' : 'Femme'}`}
                          </span>
                        </Grid>
                        <Grid row gap="small" middle>
                          <IconNoSSR name="mail" style={{ width: 20 }} />
                          <span>{user.email}</span>
                        </Grid>
                        <Grid row gap="small" middle>
                          <IconNoSSR name="phone" style={{ width: 20 }} />
                          {user.phone ? (
                            <span>{user.phone}</span>
                          ) : (
                            <span className="uk-text-italic">
                              Num??ro de t??l??phone non renseign??
                            </span>
                          )}
                        </Grid>
                        {user.role === USER_ROLES.CANDIDAT && (
                          <Grid row gap="small" middle>
                            <IconNoSSR name="home" style={{ width: 20 }} />
                            {user.address ? (
                              <span>{user.address}</span>
                            ) : (
                              <span className="uk-text-italic">
                                Adresse postale non renseign??e
                              </span>
                            )}
                          </Grid>
                        )}
                      </Grid>
                    ) : undefined}
                  </div>
                </Grid>
              )}
              <Grid childWidths={['1-1']} gap="medium">
                {(user.role === USER_ROLES.CANDIDAT ||
                  user.role === USER_ROLES.COACH) && (
                  <UserInformationCard
                    isAdmin
                    user={user}
                    onChange={(data) => {
                      setUser(data);
                    }}
                  />
                )}
                <div className="uk-flex uk-flex-center">
                  <Button
                    style="danger"
                    size="large"
                    onClick={() => {
                      openModal(
                        <ModalEdit
                          id="delete-user"
                          title="Supprimer un membre"
                          description="Attention, si vous supprimer ce membre, toutes les donn??es qui lui sont associ??es seront d??finitivement perdues. ??tes-vous s??r de vouloir continuer ?"
                          submitText="Supprimer le membre"
                          formSchema={schemaDeleteUser}
                          onSubmit={deleteUser}
                        />
                      );
                    }}
                  >
                    <span className="uk-margin-small-right">
                      Supprimer l&apos;utilisateur
                    </span>
                    <IconNoSSR name="trash" />
                  </Button>
                </div>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Section>
    </LayoutBackOffice>
  );
};

export default User;
