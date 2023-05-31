import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { usePrevious } from 'src/hooks/utils';
import { Api } from 'src/api/index.ts';
import UIkit from 'uikit';
import { CANDIDATE_USER_ROLES, COACH_USER_ROLES } from 'src/constants/users.ts';
import { isRoleIncluded } from 'src/utils/Finding.ts';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId.ts';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice.tsx';
import { Grid, Section, SimpleLink } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon.tsx';
import { MemberDetails } from 'src/components/backoffice/admin/members/MemberDetails/index.ts';
import { MEMBER_TABS } from 'src/constants/index.ts';
import { useTab } from 'src/components/backoffice/admin/members/MemberDetails/useTab.ts';
import { useMemberId } from 'src/components/backoffice/admin/members/MemberDetails/useMemberId.ts';
import schemaEditUser from 'src/components/forms/schema/formEditUser';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { USER_ROLES } from 'src/constants';
import {
  mutateFormSchema,
} from 'src/utils';import PropTypes from 'prop-types';
import { openModal } from 'src/components/modals/Modal';
import ModalConfirm from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import _ from 'lodash';

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
            const { data } = await Api.putUser(user.id, {
              ...fields,
              email: fields.email.toLowerCase(),
              firstName: fields.firstName.trim().replace(/\s\s+/g, ' '),
              lastName: fields.lastName.trim().replace(/\s\s+/g, ' '),
            });
            if (data) {
              closeModal();
              UIkit.notification('Le membre a bien été modifié', 'success');
              setUser(data);
            } else {
              throw new Error('réponse de la requete vide');
            }
          } catch (error) {
            console.error(error);
            if (onError) onError();
            if (error.response.status === 409) {
              UIkit.notification(
                'Cette adresse email est déjà utilisée',
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
              text="Attention, si vous modifiez le rôle d'un candidat, tout son suivi sera perdu et son CV sera dépublié. Êtes-vous sûr de vouloir continuer ?"
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
    ...PropTypes.shape({}),
  }).isRequired,
  setUser: PropTypes.func.isRequired,
};

const User = () => {
  const [user, setUser] = useState();

  const prevUser = usePrevious(user);

  const [loading, setLoading] = useState(true);

  const { replace } = useRouter();

  const memberId = useMemberId();
  const prevMemberId = usePrevious(memberId);

  const tab = useTab();
  const opportunityId = useOpportunityId();

  useEffect(() => {
    if (user !== prevUser && user) {
      if (
        isRoleIncluded(COACH_USER_ROLES, user.role) &&
        (!tab || tab !== MEMBER_TABS.PARAMETERS)
      ) {
        replace(
          `/backoffice/admin/membres/${user.id}/${MEMBER_TABS.PARAMETERS}`,
          undefined,
          {
            shallow: true,
          }
        );
      } else if (isRoleIncluded(CANDIDATE_USER_ROLES, user.role)) {
        if (!tab) {
          replace(`/backoffice/admin/membres/${user.id}/cv`, undefined, {
            shallow: true,
          });
        } else if (opportunityId && tab !== MEMBER_TABS.OFFERS) {
          replace(`/backoffice/admin/membres/${user.id}/${tab}`, undefined, {
            shallow: true,
          });
        }
      }
    }
  }, [opportunityId, replace, tab, prevMemberId, user, prevUser, memberId]);

  const getUser = useCallback(() => {
    Api.getUserById(memberId)
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [memberId]);

  useEffect(() => {
    if (memberId !== prevMemberId) {
      getUser();
    } else if (tab === MEMBER_TABS.PARAMETERS) {
      getUser();
    }
  }, [tab, getUser, memberId, prevMemberId]);

  if (loading) {
    return (
      <LayoutBackOffice title="Chargement - Gestion des membres">
        <Section>
          <Grid column gap="large">
            <SimpleLink
              href="/backoffice/admin/membres"
              className="uk-link-reset uk-flex uk-flex-middle"
            >
              <IconNoSSR name="chevron-left" />
              Retour à la liste
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
              Retour à la liste
            </SimpleLink>
            <div>
              <hr className="ent-divier-backoffice" />
              <h3 className="uk-text-bold">Ce profil n’est pas disponible</h3>
              <p>
                Le lien que vous avez suivi est peut-être rompu, ou la page a
                été supprimée.
              </p>
            </div>
          </Grid>
        </Section>
      </LayoutBackOffice>
    );
  }

  return <MemberDetails user={user} setUser={setUser} />;
};

export default User;
