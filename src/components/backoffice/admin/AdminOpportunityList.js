import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import formEditExternalOpportunitySchema, {
  adminMutations as externalOpportunityAdminMutations,
} from 'src/components/forms/schema/formEditExternalOpportunity';
import formEditOpportunitySchema, {
  adminMutations as opportunityAdminMutations,
} from 'src/components/forms/schema/formEditOpportunity';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { OpportunityList } from 'src/components/opportunities/OpportunityList';
import { ButtonMultiple } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';
import { usePostOpportunity } from 'src/hooks';
import { useIsDesktop } from 'src/hooks/utils';
import { mutateFormSchema } from 'src/utils';

export const AdminOpportunityList = ({
  search,
  filters,
  setFilters,
  tabFilters,
  setTabFilters,
  setSearch,
  resetFilters,
}) => {
  const isDesktop = useIsDesktop();

  // desactivation du champ de disclaimer
  const mutatedOfferSchema = mutateFormSchema(formEditOpportunitySchema, [
    {
      fieldId: 'disclaimer',
      props: [
        {
          propName: 'hidden',
          value: true,
        },
      ],
    },
    {
      fieldId: 'shouldSendNotifications',
      props: [
        {
          propName: 'hidden',
          value: false,
        },
        {
          propName: 'disabled',
          value: false,
        },
      ],
    },
    ...opportunityAdminMutations,
  ]);

  const mutatedExternalOfferSchema = mutateFormSchema(
    formEditExternalOpportunitySchema,
    [
      ...externalOpportunityAdminMutations,
      {
        fieldId: 'startEndContract',
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
    ]
  );

  const opportunityListRef = useRef();

  const { PostOpportunityModal } = usePostOpportunity({
    defaultValues: {
      isPublic: true,
    },
    isAdmin: true,
    callback: opportunityListRef?.current?.fetchData,
    modalTitle: 'Ajouter une nouvelle offre',
    schema: mutatedOfferSchema,
  });

  return (
    <>
      <HeaderBackoffice
        title="Modération des offres d'emploi"
        description="Ici vous pouvez accéder à toutes les opportunités et valider les offres envoyées par les recruteurs !"
      >
        <ButtonMultiple
          id="admin-create"
          align={isDesktop ? 'right' : 'left'}
          dataTestId="button-admin-create"
          style="custom-primary"
          buttons={[
            {
              onClick: () => {
                openModal(<PostOpportunityModal />);
              },
              label: 'Nouvelle offre',
            },
            {
              onClick: () => {
                openModal(
                  <ModalEdit
                    title="Ajouter une offre externe"
                    submitText="Envoyer"
                    formSchema={mutatedExternalOfferSchema}
                    onSubmit={async (fields, closeModal) => {
                      try {
                        await Api.postExternalOpportunity({
                          ...fields,
                          status: parseInt(fields.status, 10),
                          startOfContract: fields.startOfContract || null,
                          endOfContract: fields.endOfContract || null,
                          date: moment().toISOString(),
                          businessLines: fields.businessLines
                            ? fields.businessLines.map(
                                (businessLine, index) => {
                                  return {
                                    name: businessLine,
                                    order: index,
                                  };
                                }
                              )
                            : [],
                        });
                        closeModal();
                        await opportunityListRef?.current?.fetchData();
                        UIkit.notification(
                          "L'offre externe a bien été ajouté",
                          'success'
                        );
                      } catch (err) {
                        console.error(err);
                        UIkit.notification(
                          `Une erreur est survenue.`,
                          'danger'
                        );
                      }
                    }}
                  />
                );
              },
              label: 'Offre externe',
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
      <OpportunityList
        ref={opportunityListRef}
        tabFilters={tabFilters}
        setTabFilters={setTabFilters}
        search={search}
        filters={filters}
        resetFilters={resetFilters}
        setSearch={setSearch}
        setFilters={setFilters}
        userRole="admin"
      />
    </>
  );
};

AdminOpportunityList.propTypes = {
  search: PropTypes.string,
  filters: PropTypes.shape({}),
  setFilters: PropTypes.func,
  tabFilters: PropTypes.arrayOf(PropTypes.shape({})),
  setTabFilters: PropTypes.func,
  setSearch: PropTypes.func,
  resetFilters: PropTypes.func,
};

AdminOpportunityList.defaultProps = {
  search: undefined,
  filters: {},
  setFilters: () => {},
  tabFilters: {},
  setTabFilters: () => {},
  setSearch: () => {},
  resetFilters: () => {},
};
