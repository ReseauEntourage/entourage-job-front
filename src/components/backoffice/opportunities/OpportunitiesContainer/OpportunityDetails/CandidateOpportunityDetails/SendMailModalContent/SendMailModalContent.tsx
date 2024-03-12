import React, { useState } from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { StyledSendMailContent } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails/SendMailModalContent/SendMailContent.styles';
import { useFetchCandidateOpportunity } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/useFetchOpportunity';
import { FormFooter } from 'src/components/forms/FormFooter';
import { useModalContext, openModal } from 'src/components/modals/Modal';
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import { TextArea } from 'src/components/utils/Inputs/TextArea';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';

interface SendMailModalContentProps {
  OpportunityId: string;
  relance?: boolean;
  onSubmit: () => void;
  fetchOpportunities: () => void;
  candidateId: string;
}

export const SendMailModalContent = ({
  OpportunityId,
  relance = false,
  onSubmit,
  fetchOpportunities,
  candidateId,
}: SendMailModalContentProps) => {
  const user = useAuthenticatedUser();

  const { opportunity } = useFetchCandidateOpportunity(
    OpportunityId,
    candidateId,
    fetchOpportunities
  );
  const { onClose } = useModalContext();
  const [textAreaContent, setTextAreaContent] = useState<string>();

  const object = relance
    ? 'Relance - demande de contact'
    : 'Demande de contact';

  const description = relance ? (
    <>
      Vous pouvez ci-dessous envoyer un mail de relance pour le poste de
      developpeur web dans l’entreprise web service SA. <br />
      Nous vous recommandons d’envoyer un mail de relance après XX jours sans
      réponse de l’entreprise
    </>
  ) : (
    `Vous pouvez ci-dessous envoyer une demande de contact pour le poste de${' '}
  ${opportunity?.title} dans l’entreprise ${opportunity?.company}`
  );

  const emailContent = relance ? (
    <>
      <p>Bonjour,</p>
      <p>
        Vous n&apos;avez pas encore répondu à la candidature de {user.firstName}{' '}
        sur votre offre.
      </p>
      <p>
        Voici son CV pour en savoir plus sur son profil et prendre contact avec
        lui/elle
      </p>
      <p>
        Contactez-le/la vite pour lui indiquer si vous souhaitez ou non
        poursuivre les échanges. En cas de refus, n&apos;oubliez pas de lui
        apporter des informations complémentaires et pourquoi pas partager son
        CV à votre réseau !
      </p>
      <p>A bientôt,</p>
    </>
  ) : (
    <>
      <p>Bonjour,</p>
      <p>Un(e) candidat(e) Entourage Pro est intéressé(e) par votre offre !</p>
      <p>{user.firstName} a postulé à votre offre.</p>
      <p>
        Voici son CV pour en savoir plus sur son profil et prendre contact avec
        lui/elle.
      </p>
      <p>
        Contactez-le/la vite pour lui indiquer si vous souhaitez ou non
        poursuivre les échanges. En cas de refus, n&apos;oubliez pas de lui
        apporter des informations complémentaires et pourquoi pas partager son
        CV à votre réseau !
      </p>
      <p>A bientôt,</p>
    </>
  );

  return (
    <StyledSendMailContent>
      <div className="description">
        <p>{description}</p>
        <p>
          <span className="margin-right">Référent de l’entreprise:</span>
          {opportunity?.recruiterFirstName} {opportunity?.recruiterName}
          <br />
          <span className="margin-right">Email entreprise:</span>
          {opportunity?.recruiterMail}
        </p>
      </div>
      <div className="email-content">
        <div className="email-headers">
          <div>
            <span className="gray margin-right">De : </span>
            <span className="margin-right">coordo@entourage.social&nbsp;;</span>
            <span className="margin-right">
              {!Array.isArray(opportunity?.opportunityUsers?.user) &&
                opportunity?.opportunityUsers?.user?.email}
              &nbsp;;
            </span>
            {!Array.isArray(opportunity?.opportunityUsers?.user) &&
              opportunity?.opportunityUsers?.user?.candidat?.coach && (
                <span className="margin-right">
                  {!Array.isArray(opportunity?.opportunityUsers?.user) &&
                    opportunity?.opportunityUsers?.user?.candidat?.coach?.email}
                  &nbsp;;
                </span>
              )}
          </div>
          <div>
            <span className="gray margin-right">À :</span>
            {opportunity?.recruiterMail}
          </div>
          <div>
            <span className="gray margin-right">Objet :</span> {object}
          </div>
        </div>
        <div className="email-details">{emailContent}</div>
        <div className="textarea-container">
          <TextArea
            title="Ajouter un message personnel"
            onChange={setTextAreaContent}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            value={textAreaContent}
            name="contact-description"
            id="contact-description"
          />
        </div>
        <FormFooter
          noCompulsory
          onSubmit={async () => {
            await Api.postOpportunityContactEmployer({
              opportunityId: OpportunityId,
              type: relance ? 'relance' : 'contact',
              candidateId,
              description: textAreaContent,
            });
            UIkit.notification('Le recruteur a bien été contacté', 'success');
            await onSubmit();

            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            onClose();
          }}
          onCancel={() => {
            openModal(
              <ModalConfirm
                onConfirm={() => {
                  // @ts-expect-error after enable TS strict mode. Please, try to fix it
                  onClose();
                }}
                title="Êtes-vous sûr de vouloir abandonner?"
                buttonText="Abandonner le mail"
                text={
                  <>
                    <p>
                      Si vous avez commencé à écrire un message, celui-ci sera
                      abandonné en quittant.
                    </p>
                  </>
                }
              />
            );
          }}
          submitText="Envoyer"
          formId="send-mail-recruiter"
        />
      </div>
    </StyledSendMailContent>
  );
};
