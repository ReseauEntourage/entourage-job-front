import {
  getCandidateIdFromCoachOrCandidate,
  mutateFormSchema,
} from 'src/utils';
import Api from 'src/api/index.ts';
import moment from 'moment/moment';
import UIkit from 'uikit';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import React, { useContext, useRef } from 'react';
import { UserContext } from 'src/components/store/UserProvider';
import formEditExternalOpportunity from 'src/components/forms/schema/formEditExternalOpportunity';

const ModalExternalOffer = () => {
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
};

export default ModalExternalOffer;
