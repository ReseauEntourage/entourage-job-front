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
import Api from 'src/api/index.ts';
import {
  getCandidateIdFromCoachOrCandidate,
  mutateFormSchema,
} from 'src/utils';
import moment from 'moment';

const CandidateOpportunityList = ({
  search,
  filters,
  setFilters,
  setSearch,
  resetFilters,
  candidateId,
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
          dataTestId="candidat-add-offer"
          onClick={() => {
            openModal(
              <ModalEdit
                title={"Ajouter une offre d'emploi externe à LinkedOut"}
                description="J'ai décroché un entretien à l'extérieur : j'informe Linkedout de mes avancées !"
                submitText="Envoyer"
                formSchema={mutatedSchema}
                defaultValues={{
                  candidateId: getCandidateIdFromCoachOrCandidate(user),
                }}
                onSubmit={async (fields, closeModal) => {
                  const { businessLines, ...restFields } = fields;
                  try {
                    await Api.postExternalOpportunity({
                      ...restFields,
                      status: parseInt(fields.status, 10),
                      startOfContract: restFields.startOfContract || null,
                      endOfContract: restFields.endOfContract || null,
                      candidateId: getCandidateIdFromCoachOrCandidate(user),
                      date: moment().toISOString(),
                    });
                    closeModal();
                    opportunityListRef.current.fetchData();
                    UIkit.notification(
                      "L'offre externe a bien été ajouté à votre liste d'offres",
                      'success'
                    );
                  } catch (err) {
                    console.error(err);
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
        candidateId={candidateId}
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
  candidateId: PropTypes.string.isRequired,
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
