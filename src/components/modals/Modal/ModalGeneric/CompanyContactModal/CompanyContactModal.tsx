import React from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { formCompanyContact } from 'src/components/forms/schemas/formCompanyContact';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { FB_TAGS, GA_TAGS, LINK_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { linkEvent } from 'src/lib/lintrk';

export const CompanyContactModal = () => {
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
          UIkit.notification(
            "Merci d'avoir répondu à ce formulaire !\nNous revenons le plus rapidement possible vers vous pour convenir d'un échange.",
            'success'
          );
        } catch (error) {
          console.error(error);
          UIkit.notification(
            "Une erreur s'est produite lors de l'envoie du formulaire",
            'danger'
          );
        }
      }}
    />
  );
};
