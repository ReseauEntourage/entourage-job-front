import React, { useMemo } from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { formSendExternalMessage } from 'src/components/forms/schema/formSendExternalMessage';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { PostOpportunityModal } from 'src/components/modals/Modal/ModalGeneric/PostOpportunityModal';
import { Button } from 'src/components/utils';
import { H3, H5 } from 'src/components/utils/Headings';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { AnyToFix } from 'src/utils/Types';
import {
  StyledCVCTA,
  StyledCVCTAContainer,
  StyledCVCTACard,
} from './CVCallToActions.styles';
import { CVShareButtons } from 'src/components/partials/CV/CVShareButtons';
import { CV_COLORS } from '../PageCvContent/PageCVContent.styles';

interface CVCallToActionsProps {
  cv: AnyToFix; // finish typing
  actionDisabled?: boolean;
}

export const CVCallToActions = ({
  cv,
  actionDisabled = false,
}: CVCallToActionsProps) => {
  const isDesktop = useIsDesktop();

  const opportunityModalProps = useMemo(() => {
    return {
      modalTitle: 'Proposer une opportunité à un candidat',
      modalDesc: (
        <div className="uk-text-normal">
          Contactez ici le candidat et son coach LinkedOut afin de solliciter un
          échange.
          <br />
          <br />
          Si vous souhaitez échanger avec le coach bénévole qui accompagne le
          candidat dans sa recherche d&apos;emploi, précisez-le dans votre
          message.
          <br />
          <br />
          <span className="uk-text-meta uk-text-italic">
            LinkedOut est susceptible de transmettre cette opportunité à
            d&apos;autres candidats dont le profil correspond à votre besoin.
          </span>
        </div>
      ),
      candidateId: cv.UserId,
      defaultValues: {
        candidat: {
          firstName: cv.user.candidat.firstName,
          lastName: cv.user.candidat.lastName,
        },
        isPublic: false,
      },
    };
  }, [cv]);

  return (
    <StyledCVCTA>
      <H3
        title={`Donnez un coup de pouce à ${cv?.user?.candidat?.firstName} !`}
        center
        color={CV_COLORS.titleGray}
      />
      <StyledCVCTAContainer>
        <StyledCVCTACard className={`${!isDesktop ? 'mobile' : ''}`} order={3}>
          <H5
            title="Partagez son CV sur vos réseaux sociaux."
            center
            color="darkGrayFont"
          />
          <p>
            En le rendant visible vous pouvez créer les rencontres qui peuvent
            tout changer
          </p>
          <CVShareButtons cv={cv} actionDisabled={actionDisabled} />
        </StyledCVCTACard>
        <StyledCVCTACard className={`${!isDesktop ? 'mobile' : ''}`} order={1}>
          <H5
            title="Contactez-le pour lui apporter un coup de pouce !"
            center
            color="darkGrayFont"
          />
          <p>
            Informations sur le secteur d&apos;activité, retour
            d&apos;expérience, mise en contact&nbsp;...
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
                  } pour ${
                    cv.user.candidat.gender === 0 ? 'le' : 'la'
                  } soutenir dans sa recherche d'emploi`}
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
                      UIkit.notification(
                        'Le message a bien été envoyé',
                        'success'
                      );

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
        <StyledCVCTACard className={`${!isDesktop ? 'mobile' : ''}`} order={2}>
          <H5 title="Vous êtes recruteurs ! " center color="darkGrayFont" />
          <p>
            Donnez-vous la chance de rencontrer {cv?.user?.candidat?.firstName}{' '}
            !
          </p>
          <Button
            style="custom-secondary"
            disabled={actionDisabled}
            onClick={() => {
              gaEvent(GA_TAGS.PAGE_CV_PROPOSER_OFFRE_CLIC);
              fbEvent(FB_TAGS.COMPANY_CV_OFFER_OPEN);
              openModal(<PostOpportunityModal {...opportunityModalProps} />);
            }}
          >
            Proposer une offre
          </Button>
        </StyledCVCTACard>
      </StyledCVCTAContainer>
    </StyledCVCTA>
  );
};
