import React, { useContext, useState } from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { StyledSendMailContent } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails/SendMailModalContent/SendMailContent.styles';
import { useFetchOpportunity } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/useFetchOpportunity';
import { FormFooter } from 'src/components/forms/FormFooter/FormFooter';
import { useModalContext, openModal } from 'src/components/modals/Modal';
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import { TextArea } from 'src/components/utils/Inputs/TextArea';
import { UserContext } from 'src/store/UserProvider';

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
  const { user } = useContext(UserContext);

  const { opportunity } = useFetchOpportunity(
    OpportunityId,
    candidateId,
    fetchOpportunities
  );
  const { onClose } = useModalContext();
  const [textAreaContent, setTextAreaContent] = useState();
  const handleDescription = (e) => {
    setTextAreaContent(e.target.value);
  };

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
  const genderTab = [
    // male
    {
      term: '',
      pronoun: 'le',
      indPronoun: 'lui',
    },
    // female
    {
      term: 'e',
      pronoun: 'la',
      indPronoun: 'elle',
    },
  ];
  const emailContent = relance ? (
    <>
      <p>Bonjour,</p>
      <p>
        Vous n&apos;avez pas encore répondu à la candidature de {user.firstName}{' '}
        sur votre offre.
      </p>
      <p>
        Voici son CV pour en savoir plus sur son profil et prendre contact avec{' '}
        {genderTab[user.gender].indPronoun}.
      </p>
      <p>
        Contactez-{genderTab[user.gender].pronoun} vite pour lui indiquer si
        vous souhaitez ou non poursuivre les échanges. En cas de refus,
        n&apos;oubliez pas de lui apporter des informations complémentaires et
        pourquoi pas partager son CV à votre réseau !
      </p>
      <p>A bientôt,</p>
    </>
  ) : (
    <>
      <p>Bonjour,</p>
      <p>
        Un{genderTab[user.gender].term} candidat{genderTab[user.gender].term}{' '}
        LinkedOut est intéressé{genderTab[user.gender].term} par votre offre !
      </p>
      <p>{user.firstName} a postulé à votre offre.</p>
      <p>
        Voici son CV pour en savoir plus sur son profil et prendre contact avec{' '}
        {genderTab[user.gender].indPronoun}.
      </p>
      <p>
        Contactez-{genderTab[user.gender].pronoun} vite pour lui indiquer si
        vous souhaitez ou non poursuivre les échanges. En cas de refus,
        n&apos;oubliez pas de lui apporter des informations complémentaires et
        pourquoi pas partager son CV à votre réseau !
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
            onChange={handleDescription}
            value={textAreaContent}
            name="contact-description"
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
            onClose();
          }}
          onCancel={() => {
            openModal(
              <ModalConfirm
                onConfirm={() => {
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
