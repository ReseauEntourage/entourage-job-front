import React, { useContext, useState } from 'react';
import { PropTypes } from 'prop-types';
import { StyledSendMailContent } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails/SendMailModalContent/SendMailContent.styles';
import TextArea from 'src/components/utils/Inputs/TextArea';
import { useFetchOpportunity } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/useFetchOpportunity';
import { UserContext } from 'src/components/store/UserProvider';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils';
import FooterForm from 'src/components/forms/FooterForm';
import { useModalContext } from 'src/components/modals/Modal';
import Api from 'src/api/index.ts';

const SendMailModalContent = ({ OpportunityId, relance }) => {
  const { user } = useContext(UserContext);
  const candidateId = getCandidateIdFromCoachOrCandidate(user);
  const { opportunity } = useFetchOpportunity(OpportunityId, candidateId);
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
  const emailContent = relance ? (
    <>
      <p>Lorem ipsum dolor sit amet,</p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud.
      </p>
      <p>quis nostrud.</p>
    </>
  ) : (
    <>
      <p>Lorem ipsum dolor sit amet,</p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud.
      </p>
      <p>quis nostrud.</p>
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
              {opportunity?.opportunityUsers?.user?.email}&nbsp;;
            </span>
            {opportunity?.opportunityUsers?.user?.candidat?.coach && (
              <span className="margin-right">
                {opportunity?.opportunityUsers?.user?.candidat?.coach?.email}
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
            title="Ajouter une description personnelle"
            onChange={handleDescription}
          />
        </div>
        <FooterForm
          noCompulsory
          onSubmit={() => {
            Api.postOpportunityContactEmployer({
              opportunityId: OpportunityId,
              type: relance ? 'relance' : 'contact',
              candidateId,
              description: textAreaContent,
            });
            onClose();
          }}
          onCancel={() => {
            onClose();
          }}
          submitText="Envoyer"
          formId="send-mail-recruiter"
        />
      </div>
    </StyledSendMailContent>
  );
};

SendMailModalContent.propTypes = {
  OpportunityId: PropTypes.string.isRequired,
  relance: PropTypes.bool.isRequired,
};

export default SendMailModalContent;
