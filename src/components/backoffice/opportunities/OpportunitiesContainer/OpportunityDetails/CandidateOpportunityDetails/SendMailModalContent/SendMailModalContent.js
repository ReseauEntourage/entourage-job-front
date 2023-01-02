import React, { useContext } from 'react';
import { StyledSendMailContent } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails/SendMailModalContent/SendMailContent.styles';
import TextArea from 'src/components/utils/Inputs/TextArea';
import { useFetchOpportunity } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/useFetchOpportunity';
import { UserContext } from 'src/components/store/UserProvider';
import { getCandidateIdFromCoachOrCandidate } from 'src/utils';
import FooterForm from 'src/components/forms/FooterForm';

const SendMailModalContent = ({
  OpportunityId,
  relance,
  onSumbit,
  onCancel,
}) => {
  const { user } = useContext(UserContext);
  const candidateId = getCandidateIdFromCoachOrCandidate(user);
  const { opportunity } = useFetchOpportunity(OpportunityId, candidateId);
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
          <span className="margin-right">Référent de l'entreprise:</span>
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
            <span className="margin-right">coordo@entourage.social ;</span>
            <span className="margin-right">
              {opportunity?.opportunityUsers?.user?.email} ;
            </span>
            {opportunity?.opportunityUsers?.user?.candidat?.coach && (
              <span className="margin-right">
                {opportunity?.opportunityUsers?.user?.candidat?.coach?.email} ;
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
        <div>
          <TextArea label="Ajouter une description personnelle" />
        </div>
        <FooterForm
          error={"Une erreur esr survenue à l'envoi"}
          noCompulsory
          onSubmit={() => {
            onSumbit();
          }}
          onCancel={() => {
            onCancel();
          }}
          submitText="Envoyer"
          formId="send-mail-recruiter"
        />
      </div>
    </StyledSendMailContent>
  );
};

export default SendMailModalContent;
