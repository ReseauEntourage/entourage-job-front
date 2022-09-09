import UIkit from 'uikit';

import React, { useContext, useRef } from 'react';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import { USER_ROLES } from 'src/constants';
import OpportunityList from 'src/components/opportunities/OpportunityList';
import PropTypes from 'prop-types';

import { UserContext } from 'src/components/store/UserProvider';
import { openModal } from 'src/components/modals/Modal';
import { IconNoSSR } from 'src/components/utils/Icon';
import { Button } from 'src/components/utils';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import formEditExternalOpportunity from 'src/components/forms/schema/formEditExternalOpportunity';
import Api from 'src/Axios';
import { mutateFormSchema } from 'src/utils';

const CandidateOpportunityList = ({
  search,
  filters,
  setFilters,
  setSearch,
  resetFilters,
  candidatId,
  tabFilters,
  setTabFilters,
}) => {
  const { user } = useContext(UserContext);
  const opportunityListRef = useRef();

  const mutatedSchema = mutateFormSchema(formEditExternalOpportunity, [
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
  ]);

  return (
    <>
      <HeaderBackoffice
        title={
          user.role === USER_ROLES.CANDIDAT
            ? 'Consultez toutes les opportunités de travail'
            : 'Consultez les opportunités de travail du candidat'
        }
        description={
          user.role === USER_ROLES.CANDIDAT
            ? 'Parcourez les offres qui vous sont directement adressées ainsi que celles communes aux différents candidats du parcours LinkedOut.'
            : 'Parcourez les offres qui ont été adressées à votre candidat ainsi que celles communes aux différents candidats du parcours LinkedOut.'
        }
      >
        <Button
          style="primary"
          onClick={() => {
            openModal(
              <ModalEdit
                title={"Ajouter une offre d'emploi externe à LinkedOut"}
                description="J'ai décroché un entretien à l'extérieur : j'informe Linkedout de mes avancées !"
                submitText="Envoyer"
                formSchema={mutatedSchema}
                defaultValues={{
                  candidateId:
                    user.role === USER_ROLES.COACH ? user.candidat.id : user.id,
                }}
                onSubmit={async (fields, closeModal) => {
                  try {
                    await Api.post(`/opportunity/external`, {
                      ...fields,
                      startOfContract: fields.startOfContract || null,
                      endOfContract: fields.endOfContract || null,
                      candidateId:
                        user.role === USER_ROLES.COACH
                          ? user.candidat.id
                          : user.id,
                      date: Date.now(),
                      businessLines: undefined,
                    });
                    closeModal();
                    opportunityListRef.current.fetchData();
                    UIkit.notification(
                      "L'offre externe a bien été ajouté à votre liste d'offres",
                      'success'
                    );
                  } catch (err) {
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
          Ajouter une offre externe à LinkedOut
        </Button>
      </HeaderBackoffice>
      <OpportunityList
        ref={opportunityListRef}
        candidatId={candidatId}
        tabFilters={tabFilters}
        setTabFilters={setTabFilters}
        search={search}
        filters={filters}
        resetFilters={resetFilters}
        setSearch={setSearch}
        setFilters={setFilters}
        userRole="candidat"
      />
    </>
  );
};

CandidateOpportunityList.propTypes = {
  candidatId: PropTypes.string.isRequired,
  search: PropTypes.string,
  filters: PropTypes.shape(),
  setFilters: PropTypes.func,
  setSearch: PropTypes.func,
  resetFilters: PropTypes.func,
  tabFilters: PropTypes.arrayOf(PropTypes.shape()),
  setTabFilters: PropTypes.func,
};

CandidateOpportunityList.defaultProps = {
  search: undefined,
  filters: {},
  setFilters: () => {},
  setSearch: () => {},
  resetFilters: () => {},
  tabFilters: {},
  setTabFilters: () => {},
};

export default CandidateOpportunityList;
