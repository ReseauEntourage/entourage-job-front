import React, { useRef } from 'react';
import { usePostOpportunity } from 'src/hooks';
import { mutateFormSchema } from 'src/utils';
import formEditOpportunitySchema, {
  adminMutations as opportunityAdminMutations,
} from 'src/components/forms/schema/formEditOpportunity';
import formEditExternalOpportunitySchema, {
  adminMutations as externalOpportunityAdminMutations,
} from 'src/components/forms/schema/formEditExternalOpportunity';
import { Button } from 'src/components/utils';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import { IconNoSSR } from 'src/components/utils/Icon';
import OpportunityList from 'src/components/opportunities/OpportunityList';
import PropTypes from 'prop-types';
import { openModal } from 'src/components/modals/Modal';
import ModalEdit from 'src/components/modals/ModalEdit';
import Api from 'src/Axios';
import UIkit from 'uikit';

const AdminOpportunityList = ({
  search,
  filters,
  setFilters,
  tabFilters,
  setTabFilters,
  setSearch,
  resetFilters,
}) => {
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
        title="Mod??ration des offres d'emploi"
        description="Ici vous pouvez acc??der ?? toutes les opportunit??s et valider les offres envoy??es par les recruteurs !"
      >
        <div className="uk-flex uk-flex-column uk-flex-bottom">
          <Button
            style="primary"
            className="uk-margin-small-bottom"
            onClick={() => {
              openModal(<PostOpportunityModal />);
            }}
          >
            <IconNoSSR
              name="plus"
              ratio="0.8"
              className="uk-margin-small-right"
            />
            Cr??er une nouvelle offre
          </Button>
          <Button
            style="default"
            onClick={() => {
              openModal(
                <ModalEdit
                  title="Ajouter une offre externe"
                  submitText="Envoyer"
                  formSchema={mutatedExternalOfferSchema}
                  onSubmit={async (fields, closeModal) => {
                    try {
                      await Api.post(`/opportunity/external`, {
                        ...fields,
                        startOfContract: fields.startOfContract || null,
                        endOfContract: fields.endOfContract || null,
                        date: Date.now(),
                        businessLines: fields.businessLines
                          ? fields.businessLines.map((businessLine, index) => {
                              return {
                                name: businessLine,
                                order: index,
                              };
                            })
                          : [],
                      });
                      closeModal();
                      await opportunityListRef?.current?.fetchData();
                      UIkit.notification(
                        "L'offre externe a bien ??t?? ajout??",
                        'success'
                      );
                    } catch (err) {
                      console.log(err);
                      UIkit.notification(`Une erreur est survenue.`, 'danger');
                    }
                  }}
                />
              );
            }}
          >
            <IconNoSSR
              name="plus"
              ratio="0.8"
              className="uk-margin-small-right"
            />
            Ajouter une offre externe
          </Button>
        </div>
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
  filters: PropTypes.shape(),
  setFilters: PropTypes.func,
  tabFilters: PropTypes.arrayOf(PropTypes.shape()),
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

export default AdminOpportunityList;
