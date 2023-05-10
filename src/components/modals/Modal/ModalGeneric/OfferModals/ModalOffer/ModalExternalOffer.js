import { getCandidateIdFromCoachOrCandidate } from 'src/utils';
import Api from 'src/api/index.ts';
import moment from 'moment/moment';
import UIkit from 'uikit';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import React, { useContext } from 'react';
import { UserContext } from 'src/store/UserProvider';
// import formEditExternalOpportunity from 'src/components/forms/schema/formEditExternalOpportunity';
import PropTypes from 'prop-types';
import { formAddExternalOpportunityCandidate } from 'src/components/forms/schema/formAddExternalOpportunity';

const ModalExternalOffer = ({ fetchOpportunities }) => {
  const { user } = useContext(UserContext);

  // const mutatedSchema = mutateFormSchema(formEditExternalOpportunity, [
  //   {
  //     fieldId: 'startEndContract',
  //     props: [
  //       {
  //         propName: 'hidden',
  //         value: true,
  //       },
  //       {
  //         propName: 'disabled',
  //         value: true,
  //       },
  //     ],
  //   },
  // ]);

  return (
    <ModalEdit
      title={"Ajouter une offre d'emploi externe à LinkedOut"}
      description="J'ai décroché un entretien à l'extérieur : j'informe LinkedOut de mes avancées !"
      submitText="Envoyer"
      formSchema={formAddExternalOpportunityCandidate}
      defaultValues={{
        candidateId: getCandidateIdFromCoachOrCandidate(user),
        coachNotification: true,
      }}
      onSubmit={async (fields, closeModal) => {
        try {
          await Api.postExternalOpportunity({
            ...fields,
            status: parseInt(fields.status, 10),
            // startOfContract: restFields.startOfContract || null,
            // endOfContract: restFields.endOfContract || null,
            candidateId: getCandidateIdFromCoachOrCandidate(user),
            date: moment().toISOString(),
          });
          closeModal();
          await fetchOpportunities();
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
};

ModalExternalOffer.propTypes = {
  fetchOpportunities: PropTypes.func.isRequired,
};

export default ModalExternalOffer;
