import React from 'react';
import UIkit from 'uikit';
import { CVType } from '../../CV.type';
import { StyledCVCTACard } from '../CVCallToActions.styles';
import { Api } from 'src/api';
import { formSendExternalMessage } from 'src/components/forms/schema/formSendExternalMessage';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Button } from 'src/components/utils';
import { H5 } from 'src/components/utils/Headings';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';

interface CVCallToActionsProps {
  cv: CVType;
  actionDisabled?: boolean;
}

export const CVSendMessage = ({
  cv,
  actionDisabled = false,
}: CVCallToActionsProps) => {
  const isDesktop = useIsDesktop();
  return (
    <StyledCVCTACard className={`${!isDesktop ? 'mobile' : ''}`} order={1}>
      <H5
        title="Contactez-le pour lui apporter un coup de pouce&nbsp;!"
        center
        color="darkGrayFont"
      />
      <p>
        Informations sur le secteur d&apos;activité, retour d&apos;expérience,
        mise en contact&nbsp;...
      </p>
      <Button
        style="custom-secondary-inverted"
        disabled={actionDisabled}
        onClick={() => {
          gaEvent(GA_TAGS.PAGE_CV_CONTACTEZ_MOI_CLIC);
          fbEvent(FB_TAGS.MESSAGE_OPEN);
          openModal(
            <ModalEdit
              title={`Envoyer un message à ${cv.user.candidat.firstName}`}
              description={`Vous pouvez envoyer un message à ${
                cv.user.candidat.firstName
              } pour l'aider et ${
                cv.user.candidat.gender === 0 ? 'le' : 'la'
              } conseiller dans sa recherche d'emploi`}
              submitText="Envoyer"
              formSchema={formSendExternalMessage}
              onSubmit={async ({ optIn, ...fields }, closeModal) => {
                gaEvent(GA_TAGS.PAGE_CV_ENVOYER_CONTACTEZ_MOI_CLIC);
                fbEvent(FB_TAGS.MESSAGE_SEND);
                try {
                  await Api.postExternalMessage({
                    UserId: cv.UserId,
                    ...fields,
                  });
                  UIkit.notification('Le message a bien été envoyé', 'success');

                  closeModal();
                } catch (err) {
                  UIkit.notification("Une erreur s'est produite", 'danger');
                  console.error(err);
                }
              }}
            />
          );
        }}
      >
        Envoyer un message
      </Button>
    </StyledCVCTACard>
  );
};
