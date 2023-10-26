// import moment from 'moment';
import React from 'react';
// import UIkit from 'uikit';
// import { Api } from 'src/api';
// import { formAddExternalOpportunityAsAdmin } from 'src/components/forms/schemas/formAddExternalOpportunity';
// import { formAddOpportunityAsAdmin } from 'src/components/forms/schemas/formAddOpportunity';
// import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
// import { openModal } from 'src/components/modals/Modal';
// import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
// import { PostOpportunityModal } from 'src/components/modals/Modal/ModalGeneric/PostOpportunityModal/PostOpportunityModal';
// import { OpportunityList } from 'src/components/opportunities/OpportunityList';
// import { ButtonMultiple } from 'src/components/utils';
// import { Icon } from 'src/components/utils/Icon';
// import { useIsDesktop } from 'src/hooks/utils';
// import { AnyToFix } from 'src/utils/Types';

// interface AdminOpportunityListProps {
//   filters: AnyToFix; // to be typed
//   setFilters: (updatedFilters: AnyToFix) => void;
//   setTabFilters: (updatedFilters: AnyToFix) => void;
//   tabFilters: AnyToFix[];
//   search?: string;
//   setSearch: (search?: string) => void;
//   resetFilters: () => void;
// }
export const AdminOpportunityList = () =>
  // {
  // search,
  // filters,
  // setFilters,
  // tabFilters,
  // setTabFilters,
  // setSearch,
  // resetFilters,
  // }
  {
    // const isDesktop = useIsDesktop();

    // const opportunityListRef = useRef<{ fetchData: () => Promise<void> }>();

    // const opportunityModalProps = {
    //   defaultValues: {
    //     isPublic: true,
    //   },
    //   isAdmin: true,
    //   callback: opportunityListRef?.current?.fetchData,
    //   modalTitle: 'Ajouter une nouvelle offre',
    //   formSchema: formAddOpportunityAsAdmin,
    // };

    return (
      <>
        {/* <HeaderBackoffice
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
                openModal(<PostOpportunityModal {...opportunityModalProps} />);
              },
              label: 'Nouvelle offre',
            },
            {
              onClick: () => {
                openModal(
                  <ModalEdit
                    title="Ajouter une offre externe"
                    submitText="Envoyer"
                    formSchema={formAddExternalOpportunityAsAdmin}
                    onSubmit={async (fields, closeModal) => {
                      try {
                        await Api.postExternalOpportunity({
                          ...fields,
                          department: fields.department.value,
                          candidateId: fields.candidateId.value,
                          date: moment().toISOString(),
                          businessLines: fields.businessLines
                            ? fields.businessLines.map(
                                (businessLine, index) => {
                                  return {
                                    name: businessLine.value,
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
          <Icon name="plus" ratio={0.8} className="uk-margin-small-right" />
          Créer
        </ButtonMultiple>
      </HeaderBackoffice>
      <OpportunityList
        innerRef={opportunityListRef}
        tabFilters={tabFilters}
        setTabFilters={setTabFilters}
        search={search}
        filters={filters}
        resetFilters={resetFilters}
        setSearch={setSearch}
        setFilters={setFilters}
        userRole="admin"
      /> */}
      </>
    );
  };
