import moment from 'moment/moment';
import React from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { formAddExternalOpportunityCandidate } from 'src/components/forms/schemas/formAddExternalOpportunity';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';

export const ModalExternalOffer = ({
  fetchOpportunities,
  candidateId,
}: {
  fetchOpportunities: () => void;
  candidateId: string;
}) => {
  return (
    <ModalEdit
      title={"Ajouter une offre d'emploi externe à Entourage Pro"}
      description="J'ai décroché un entretien à l'extérieur : j'informe Entourage Pro de mes avancées !"
      submitText="Envoyer"
      formSchema={formAddExternalOpportunityCandidate}
      defaultValues={{
        coachNotification: true,
      }}
      onSubmit={async (fields, closeModal) => {
        try {
          await Api.postExternalOpportunity({
            ...fields,
            candidateId,
            department: fields.department.value,
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
