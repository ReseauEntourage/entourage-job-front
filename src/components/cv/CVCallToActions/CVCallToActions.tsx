import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
import UIkit from 'uikit';
import FacebookIcon from 'public/static/img/icons/facebook.svg';
import LinkedInIcon from 'public/static/img/icons/linked-in.svg';
import TwitterIcon from 'public/static/img/icons/twitter.svg';
import WhatsappIcon from 'public/static/img/icons/whatsapp.svg';
import { Api } from 'src/api';
import { formSendExternalMessage } from 'src/components/forms/schema/formSendExternalMessage';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { PostOpportunityModal } from 'src/components/modals/Modal/ModalGeneric/PostOpportunityModal';
import { ModalShareCV } from 'src/components/modals/Modal/ModalGeneric/StepperModal/ModalShareCV';
import { Button, Icon } from 'src/components/utils';
import { H3, H5 } from 'src/components/utils/Headings';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { useIsDesktop } from 'src/hooks/utils';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { AnyToFix } from 'src/utils/Types';
import {
  StyledCVCTA,
  StyledCVCTAContainer,
  StyledCVShareBUtton,
  StyledCVShareButtonsContainer,
} from './CVCallToActions.styles';

interface CVCallToActionsProps {
  cv: AnyToFix; // finish typing
  actionDisabled?: boolean;
  updateSharesCount: (candidateId: string, type: AnyToFix) => void; // finish typing
}

export const CVCallToActions = ({
  cv,
  updateSharesCount,
  actionDisabled = false,
}: CVCallToActionsProps) => {
  const isDesktop = useIsDesktop();

  const openNewsletterModal = useCallback(() => {
    openModal(<ModalShareCV firstName={cv.user.candidat.firstName} />);
  }, [cv.user.candidat.firstName]);

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

  const { asPath } = useRouter();
  const hostname = process.env.SERVER_URL;
  const path = asPath.includes('?')
    ? asPath.slice(0, asPath.indexOf('?'))
    : asPath;
  const link = `${hostname}${path}`;
  const hashtags = ['LinkedOut'];
  const candidateExists = cv && cv.user && cv.user.candidat;
  const sharedDescription = candidateExists
    ? `La précarité n'exclut pas les compétences\xa0! Avec LinkedOut, aidons ${cv.user.candidat.firstName} à retrouver un emploi en lui proposant un job ou en diffusant son CV\xa0!`
    : '';
  const title = candidateExists
    ? `LinkedOut\xa0: Aidez ${cv.user.candidat.firstName} à retrouver un emploi`
    : '';

  return (
    <div>
      <H3
        title={`Donnez un coup de pouce à ${cv?.user?.candidat?.firstName} !`}
        center
      />
      <StyledCVCTA>
        <StyledCVCTAContainer
          className={`${!isDesktop ? 'mobile' : ''}`}
          order={3}
        >
          <H5
            title="Partagez son CV sur vos réseaux sociaux."
            center
            color="darkGrayFont"
          />
          <p>
            En le rendant visible vous pouvez créer les rencontres qui peuvent
            tout changer
          </p>
          <StyledCVShareButtonsContainer>
            <LinkedinShareButton
              disabled={actionDisabled}
              onShareWindowClose={() => {
                gaEvent(GA_TAGS.PAGE_CV_PARTAGE_CV_LINKEDIN_CLIC);
                fbEvent(FB_TAGS.SHARE_CV);
                updateSharesCount(cv.UserId, 'linkedin');
                openNewsletterModal();
              }}
              url={link}
              title={title}
              summary={sharedDescription}
            >
              <StyledCVShareBUtton>
                <LinkedInIcon />
              </StyledCVShareBUtton>
            </LinkedinShareButton>
            <FacebookShareButton
              disabled={actionDisabled}
              onShareWindowClose={() => {
                gaEvent(GA_TAGS.PAGE_CV_PARTAGE_CV_FACEBOOK_CLIC);
                fbEvent(FB_TAGS.SHARE_CV);
                updateSharesCount(cv.UserId, 'facebook');
                openNewsletterModal();
              }}
              url={link}
              quote={sharedDescription}
              hashtags={hashtags}
            >
              <StyledCVShareBUtton>
                <FacebookIcon />
              </StyledCVShareBUtton>
            </FacebookShareButton>
            <TwitterShareButton
              disabled={actionDisabled}
              onShareWindowClose={() => {
                gaEvent(GA_TAGS.PAGE_CV_PARTAGE_CV_TWITTER_CLIC);
                fbEvent(FB_TAGS.SHARE_CV);
                updateSharesCount(cv.UserId, 'twitter');
                openNewsletterModal();
              }}
              url={link}
              title={sharedDescription}
              hashtags={hashtags}
              via="R_Entourage"
            >
              <StyledCVShareBUtton>
                <TwitterIcon />
              </StyledCVShareBUtton>
            </TwitterShareButton>
            <WhatsappShareButton
              disabled={actionDisabled}
              onShareWindowClose={() => {
                gaEvent(GA_TAGS.PAGE_CV_PARTAGE_CV_WHATSAPP_CLIC);
                fbEvent(FB_TAGS.SHARE_CV);
                updateSharesCount(cv.UserId, 'whatsapp');
                openNewsletterModal();
              }}
              url={link}
              title={sharedDescription}
            >
              <StyledCVShareBUtton>
                <WhatsappIcon />
              </StyledCVShareBUtton>
            </WhatsappShareButton>
          </StyledCVShareButtonsContainer>
        </StyledCVCTAContainer>
        <StyledCVCTAContainer
          className={`${!isDesktop ? 'mobile' : ''}`}
          order={1}
        >
          <H5
            title="Contactez-le pour lui apporter des conseils !"
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
        </StyledCVCTAContainer>
        <StyledCVCTAContainer
          className={`${!isDesktop ? 'mobile' : ''}`}
          order={2}
        >
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
            Proposer une offre de poste
          </Button>
        </StyledCVCTAContainer>
      </StyledCVCTA>
    </div>
  );
};
