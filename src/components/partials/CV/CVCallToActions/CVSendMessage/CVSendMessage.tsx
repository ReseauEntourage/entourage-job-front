import React from 'react';
import { useDispatch } from 'react-redux';

import { StyledCVCTACard } from '../CVCallToActions.styles';
import { Api } from 'src/api';
import { CV } from 'src/api/types';
import { formSendExternalMessage } from 'src/components/forms/schemas/formSendExternalMessage';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Button } from 'src/components/utils';
import { H5 } from 'src/components/utils/Headings';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { notificationsActions } from 'src/use-cases/notifications';

interface CVCallToActionsProps {
  cv: CV;
  actionDisabled?: boolean;
}

export const CVSendMessage = ({
  cv,
  actionDisabled = false,
}: CVCallToActionsProps) => {
  const dispatch = useDispatch();
  const isDesktop = useIsDesktop();
  return (
    <StyledCVCTACard className={`${!isDesktop ? 'mobile' : ''}`} order={1}>
      <H5
        title={`Echangez avec ${cv.user.candidat.firstName}`}
        center
        color="darkGray"
      />
      <p>
        Conseils, informations sur le secteur d&#8217;activité, mise en
        relation&nbsp;...
      </p>
      <Button
        variant="primary"
        rounded
        disabled={actionDisabled}
        onClick={() => {
          gaEvent(GA_TAGS.PAGE_CV_CONTACTEZ_MOI_CLIC);
          fbEvent(FB_TAGS.MESSAGE_OPEN);
          openModal(
            <ModalEdit
              title={`Envoyer un message à ${cv.user.candidat.firstName}`}
              description={`Vous pouvez envoyer un message à ${cv.user.candidat.firstName} pour l'aider et le/la conseiller dans sa recherche d'emploi`}
              submitText="Envoyer"
              formSchema={formSendExternalMessage}
              onSubmit={async (fields, closeModal) => {
                gaEvent(GA_TAGS.PAGE_CV_ENVOYER_CONTACTEZ_MOI_CLIC);
                fbEvent(FB_TAGS.MESSAGE_SEND);
                try {
                  await Api.postExternalMessage({
                    UserId: cv.UserId,
                    ...fields,
                  });
                  dispatch(
                    notificationsActions.addNotification({
                      type: 'success',
                      message: 'Le message a bien été envoyé',
                    })
                  );
                  closeModal();
                } catch (err) {
                  dispatch(
                    notificationsActions.addNotification({
                      type: 'danger',
                      message: "Une erreur s'est produite",
                    })
                  );
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
