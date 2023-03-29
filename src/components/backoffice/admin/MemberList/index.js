import UIkit from 'uikit';

import React, { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import useDeepCompareEffect from 'use-deep-compare-effect';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import { Button } from 'src/components/utils/Button';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import Api from 'src/api/index.ts';
import SearchBar from 'src/components/filters/SearchBar';
import {
  areRolesIncluded,
  filtersToQueryParams,
  mutateFormSchema,
} from 'src/utils';
import schemaCreateUser from 'src/components/forms/schema/formEditUser';
import { formAddOrganization } from 'src/components/forms/schema/formAddOrganization.ts';
import { openModal } from 'src/components/modals/Modal';
import { useIsDesktop, usePrevious } from 'src/hooks/utils';

import {
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  MEMBER_FILTERS_DATA,
  USER_ROLES,
} from 'src/constants';
import { Section, ButtonMultiple } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';
import { Member } from 'src/components/backoffice/admin/MemberList/Member';
import BackToTop from 'src/components/utils/BackToTop/index';
import {
  StyledActionsContainer,
  StyledTable,
} from 'src/components/backoffice/admin/MemberList/styles';
import { useBulkActions } from 'src/hooks/useBulkActions';
import { GA_TAGS } from 'src/constants/tags';

const LIMIT = 50;

const MemberList = ({
  search,
  filters,
  setFilters,
  setSearch,
  resetFilters,
}) => {
  const isDesktop = useIsDesktop();

  const {
    query: { role },
  } = useRouter();

  const prevRole = usePrevious(role);
  const [filtersConst, setFiltersConst] = useState(MEMBER_FILTERS_DATA);

  const [numberOfResults, setNumberOfResults] = useState(0);

  const [members, setMembers] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allLoaded, setAllLoaded] = useState(false);
  const [offset, setOffset] = useState(0);

  const mutatedSchema = mutateFormSchema(schemaCreateUser, [
    {
      fieldId: 'role',
      props: [
        {
          propName: 'hidden',
          value: false,
          option: USER_ROLES.ADMIN,
        },
      ],
    },
  ]);

  const fetchData = useCallback(
    (searchValue, filtersValue, roleValue, offsetValue, doReset) => {
      setHasError(false);
      if (doReset) {
        setLoading(true);
        setMembers([]);
      }
      Api.getUsersMembers({
        params: {
          limit: LIMIT,
          offset: doReset ? 0 : offsetValue,
          role: roleValue,
          query: searchValue,
          ...filtersToQueryParams(filtersValue),
        },
      })
        .then(({ data }) => {
          if (doReset) {
            setMembers(data);
            setNumberOfResults(data.length);
            setOffset(LIMIT);
            setAllLoaded(false);
          } else {
            setMembers((prevMembers) => {
              return [...prevMembers, ...data];
            });
            setOffset((prevOffset) => {
              return prevOffset + LIMIT;
            });
            setNumberOfResults((prevNumberOfResults) => {
              return prevNumberOfResults + data.length;
            });
          }

          if (data.length < LIMIT) {
            setAllLoaded(true);
          }
        })
        .catch((err) => {
          console.error(err);
          setHasError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    []
  );

  const { selectElement, executeAction, hasSelection } = useBulkActions(
    'candidate',
    async () => {
      await fetchData(search, filters, role, offset, true);
    },
    GA_TAGS.BACKOFFICE_ADMIN_MASQUER_MASSE_CLIC
  );

  useDeepCompareEffect(() => {
    fetchData(search, filters, role, offset, true);
  }, [search, filters, role]);

  useEffect(() => {
    if (role !== prevRole) {
      const initialFiltersConst = areRolesIncluded(COACH_USER_ROLES, [role])
        ? [MEMBER_FILTERS_DATA[0], MEMBER_FILTERS_DATA[2]]
        : MEMBER_FILTERS_DATA;

      setFiltersConst(initialFiltersConst);
    }
  }, [prevRole, role]);

  const roleToPage = {
    Candidat: 'candidates',
    Coach: 'coachs',
  };

  const handleSelectedMembers = (memberId) => {
    selectElement({ id: memberId });
  };

  return (
    <>
      <BackToTop />
      <HeaderBackoffice
        title={`Gestion des ${role?.toLocaleLowerCase()}s`}
        description={`Ici vous pouvez accéder à tous les profils des ${
          role?.toLocaleLowerCase() || 'membres'
        }s afin d'effectuer un suivi individuel de leur avancée.`}
        page={roleToPage[role]}
      >
        <ButtonMultiple
          id="admin-create"
          align={isDesktop ? 'right' : 'left'}
          dataTestId="button-admin-create"
          style="custom-primary"
          buttons={[
            {
              onClick: () => {
                openModal(
                  <ModalEdit
                    formSchema={mutatedSchema}
                    title="Création de membre"
                    description="Merci de renseigner quelques informations afin de créer le membre"
                    submitText="Créer le membre"
                    onSubmit={async (fields, closeModal) => {
                      try {
                        const { data } = await Api.postUser({
                          ...fields,
                          adminRole:
                            fields.role === USER_ROLES.ADMIN
                              ? fields.adminRole
                              : null,
                        });
                        if (data) {
                          closeModal();
                          UIkit.notification(
                            'Le membre a bien été créé',
                            'success'
                          );
                          await fetchData(search, filters, role, offset, true);
                        } else {
                          UIkit.notification(
                            "Une erreur s'est produite lors de la création du membre",
                            'danger'
                          );
                        }
                      } catch (error) {
                        console.error(error);
                        if (error?.response?.status === 409) {
                          UIkit.notification(
                            'Cette adresse email est déjà utilisée',
                            'danger'
                          );
                        } else {
                          UIkit.notification(
                            "Une erreur s'est produite lors de la création du membre",
                            'danger'
                          );
                        }
                      }
                    }}
                  />
                );
              },
              label: 'Nouveau membre',
            },
            {
              onClick: () => {
                openModal(
                  <ModalEdit
                    formId={formAddOrganization.id}
                    formSchema={formAddOrganization}
                    title="Création de structure partenaire"
                    description="Merci de renseigner quelques informations afin de créer la structure"
                    submitText="Créer la structure"
                    onSubmit={async (fields, closeModal) => {
                      try {
                        const { data } = await Api.postOrganization(fields);
                        if (data) {
                          closeModal();
                          UIkit.notification(
                            'La structure a bien été créé',
                            'success'
                          );
                        } else {
                          UIkit.notification(
                            "Une erreur s'est produite lors de la création de la structure",
                            'danger'
                          );
                        }
                      } catch (error) {
                        console.error(error);
                        UIkit.notification(
                          "Une erreur s'est produite lors de la création de la structure",
                          'danger'
                        );
                      }
                    }}
                  />
                );
              },
              dataTestId: 'button-create-organization',
              label: 'Nouvelle structure',
            },
          ]}
        >
          <IconNoSSR
            name="plus"
            ratio={0.8}
            className="uk-margin-small-right"
          />
          Créer
        </ButtonMultiple>
      </HeaderBackoffice>
      {hasError ? (
        <Section className="uk-width-1-1">
          <div className=" uk-text-center uk-flex uk-flex-center">
            <div className="uk-width-xlarge">
              <h2 className="uk-margin-remove">
                Les membres n&apos;ont pas pu etre chargés correctement.
              </h2>
              <p>
                Contacte{' '}
                <span className="uk-text-primary">l&apos;équipe LinkedOut</span>{' '}
                pour en savoir plus.
              </p>
            </div>
          </div>
        </Section>
      ) : (
        <>
          <SearchBar
            filtersConstants={filtersConst}
            filters={filters}
            numberOfResults={numberOfResults}
            resetFilters={resetFilters}
            search={search}
            setSearch={setSearch}
            setFilters={setFilters}
            placeholder="Rechercher..."
            smallSelectors
          />
          {areRolesIncluded(CANDIDATE_USER_ROLES, [role]) && (
            <StyledActionsContainer>
              <Button
                style="custom-secondary small"
                disabled={!hasSelection}
                color="primaryOrange"
                onClick={() => {
                  return executeAction({ hidden: true }, 'put');
                }}
              >
                Masquer CV
              </Button>
            </StyledActionsContainer>
          )}
          {loading ? (
            <LoadingScreen />
          ) : (
            <div className="uk-overflow-auto uk-margin-top table-wrapper">
              <StyledTable>
                <thead>
                  <tr>
                    <th className="uk-text-nowrap">{role}</th>
                    {areRolesIncluded(CANDIDATE_USER_ROLES, [role]) && (
                      <th>Coach</th>
                    )}
                    {areRolesIncluded(COACH_USER_ROLES, [role]) && (
                      <th>Candidat</th>
                    )}
                    <th>Zone</th>
                    <th>Dernière connexion</th>
                    {areRolesIncluded(CANDIDATE_USER_ROLES, [role]) && (
                      <>
                        <th>En emploi</th>
                        <th>Statut CV</th>
                        <th>CV masqué</th>
                        <th>Sélection</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody data-testid="member-list">
                  {members.map((member, key) => {
                    return (
                      <Member
                        role={role}
                        member={member}
                        key={key}
                        callback={handleSelectedMembers}
                      />
                    );
                  })}
                </tbody>
              </StyledTable>
            </div>
          )}
          {!loading && !allLoaded && (
            <div
              style={{ borderTop: '1px solid #e5e5e5' }}
              className="uk-text-center uk-width-1-1 uk-padding"
            >
              <Button
                style="custom-secondary"
                color="primaryOrange"
                onClick={async () => {
                  await fetchData(search, filters, role, offset, false);
                }}
              >
                Voir tous les {role?.toLocaleLowerCase()}s
              </Button>
            </div>
          )}
          {!loading && allLoaded && members.length <= 0 && (
            <div className="uk-height-small uk-flex uk-flex-center uk-flex-middle">
              <p className="uk-text-italic">Aucun membre trouvé</p>
            </div>
          )}
        </>
      )}
    </>
  );
};

MemberList.propTypes = {
  search: PropTypes.string,
  filters: PropTypes.shape({}),
  setFilters: PropTypes.func,
  setSearch: PropTypes.func,
  resetFilters: PropTypes.func,
};

MemberList.defaultProps = {
  search: undefined,
  filters: {},
  setFilters: () => {},
  setSearch: () => {},
  resetFilters: () => {},
};

export default MemberList;
