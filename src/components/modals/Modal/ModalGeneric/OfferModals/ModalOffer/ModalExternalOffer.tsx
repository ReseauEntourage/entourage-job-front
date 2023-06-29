import moment from 'moment/moment';
import React from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { formAddExternalOpportunityCandidate } from 'src/components/forms/schema/formAddExternalOpportunity';
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
      title={"Ajouter une offre d'emploi externe à LinkedOut"}
      description="J'ai décroché un entretien à l'extérieur : j'informe LinkedOut de mes avancées !"
      submitText="Envoyer"
      formSchema={formAddExternalOpportunityCandidate}
      defaultValues={{
        candidateId,
        coachNotification: true,
      }}
      onSubmit={async (fields, closeModal) => {
        try {
          await Api.postExternalOpportunity({
            ...fields,
            status: parseInt(fields.status, 10),
            candidateId,
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
