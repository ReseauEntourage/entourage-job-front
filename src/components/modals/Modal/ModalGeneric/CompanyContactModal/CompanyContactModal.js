import React from 'react';
import formCompanyContact from 'src/components/forms/schema/formCompanyContact';
import { Api } from 'src/api/index.ts';
import { gaEvent } from 'src/lib/gtag.ts';
import { FB_TAGS, GA_TAGS, LINK_TAGS } from 'src/constants/tags';
import UIkit from 'uikit';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { fbEvent } from 'src/lib/fb.ts';
import { linkEvent } from 'src/lib/lintrk.ts';

const CompanyContactModal = () => {
  return (
    <ModalEdit
      submitText="Envoyer"
      title="Contacter un référent LinkedOut"
      description="Contactez le référent LinkedOut de votre région pour échanger sur votre projet avant de vous lancer !"
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

export default CompanyContactModal;
