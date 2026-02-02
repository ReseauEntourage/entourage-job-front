import React from 'react';
import { useDispatch } from 'react-redux';

import { ModalEdit } from '@/src/features/modals/Modal/ModalGeneric/ModalEdit';
import { Api } from 'src/api';
import { FB_TAGS, GA_TAGS, LINK_TAGS } from 'src/constants/tags';
import { formCompanyContact } from 'src/features/forms/schemas/formCompanyContact';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { linkEvent } from 'src/lib/lintrk';
import { notificationsActions } from 'src/use-cases/notifications';

export const CompanyContactModal = () => {
  const dispatch = useDispatch();
  return (
    <ModalEdit
      submitText="Envoyer"
      title="Contacter un référent Entourage Pro"
      description="Contactez le référent Entourage Pro de votre région pour échanger sur votre projet avant de vous lancer !"
      formSchema={formCompanyContact}
      onSubmit={async (fields, closeModal) => {
        try {
          await Api.postContactCompany(fields);
          gaEvent(GA_TAGS.PAGE_ENTREPRISES_ENVOYER_CONTACT_REFERENT_CLIC);
          fbEvent(FB_TAGS.COMPANY_CONTACT_SEND);
          linkEvent(LINK_TAGS.COMPANY_CONTACT_SEND);
          closeModal();
          dispatch(
            notificationsActions.addNotification({
              type: 'success',
              message:
                "Merci d'avoir répondu à ce formulaire !\nNous revenons le plus rapidement possible vers vous pour convenir d'un échange.",
            })
          );
        } catch (error) {
          console.error(error);
          dispatch(
            notificationsActions.addNotification({
              type: 'danger',
              message:
                "Une erreur s'est produite lors de l'envoie du formulaire",
            })
          );
        }
      }}
    />
  );
};
