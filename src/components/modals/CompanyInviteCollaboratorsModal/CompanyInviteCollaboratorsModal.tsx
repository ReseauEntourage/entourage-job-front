import React, { useState } from 'react';
import { DefaultValues } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import {
  IlluCoachEtCandidat,
  IlluCoeurMainsOuvertesBleu,
  IlluOrdiCV,
} from '@/assets/icons/icons';
import { companyActions } from '@/src/use-cases/company';
import { ExtractFormSchemaValidation } from '../../forms/FormSchema';
import { FormWithValidation } from '../../forms/FormWithValidation';
import { formInviteCompanyCollaborators } from '../../forms/schemas/formInviteCompanyCollaborators';
import { ModalGeneric } from '../Modal/ModalGeneric';
import { Button, Text } from 'src/components/utils';
import {
  StyledButtonContainer,
  StyledModalSection,
  StyledPreambleStep,
  StyledPreambleStepContainer,
} from './CompanyInviteCollaboratorsModal.styles';

export interface CompanyInviteCollaboratorsModalProps {
  companyId: string;
}

export function CompanyInviteCollaboratorsModal({
  companyId,
}: CompanyInviteCollaboratorsModalProps) {
  const dispatch = useDispatch();
  const [hasSeenPreamble, setHasSeenPreamble] = useState<boolean>(false);
  const [closeModal, setCloseModal] = useState<boolean>(false);

  const defaultValues: DefaultValues<
    ExtractFormSchemaValidation<typeof formInviteCompanyCollaborators>
  > = {
    emails: [],
  };

  const dispatchOnSubmit = (fields) => {
    dispatch(
      companyActions.inviteCollaboratorsRequested({
        companyId,
        emails: fields.emails.map((e) => e.value),
      })
    );
  };

  const preambleStep = (
    <>
      <StyledModalSection>
        <Text weight="bold" size="large">
          La mission de coach
        </Text>
        <Text>
          La mission de coach consiste à donner des coups de pouce à des
          candidat(e)s afin qu’ils aient toutes les cartes en main pour
          appréhender le monde professionnel et y trouver leur place. (Aider à
          définir un projet professionnel, relire un CV, passer entretien
          d’embauche). <br />
          C’est un format d’engagement souple, qui permet de s’engager selon ses
          disponibilités.
        </Text>
      </StyledModalSection>
      <StyledModalSection>
        <Text weight="bold" size="large">
          Comment ca se passe ?
        </Text>
        <StyledPreambleStepContainer>
          <StyledPreambleStep>
            <IlluOrdiCV width={60} height={60} />
            <Text>
              Vos collaborateurs recevront un email les invitant à rejoindre
              Entourage Pro et se créer un compte. Voir
            </Text>
          </StyledPreambleStep>
          <StyledPreambleStep>
            <IlluCoachEtCandidat width={60} height={60} />
            <Text>
              Les collaborateurs vont pouvoir contacter et accompagner des
              candidats
            </Text>
          </StyledPreambleStep>
          <StyledPreambleStep>
            <IlluCoeurMainsOuvertesBleu width={60} height={60} />
            <Text>
              Suivre l’engagement de vos collaborateurs sur la plateforme
            </Text>
          </StyledPreambleStep>
        </StyledPreambleStepContainer>
      </StyledModalSection>
      <StyledButtonContainer>
        <Button variant="secondary" onClick={() => setCloseModal(true)}>
          Fermer
        </Button>
        <Button onClick={() => setHasSeenPreamble(true)}>
          Inviter des collaborateurs
        </Button>
      </StyledButtonContainer>
    </>
  );

  const formStep = (
    <FormWithValidation
      submitText="Envoyer les invitations"
      cancelText="Fermer"
      formSchema={formInviteCompanyCollaborators}
      defaultValues={defaultValues}
      onSubmit={(fields) => {
        dispatchOnSubmit(fields);
        setCloseModal(true);
      }}
    />
  );
  return (
    <ModalGeneric
      title="Invitez vos collaborateurs à devenir coachs bénévoles"
      size="large"
      closeOnNextRender={closeModal}
    >
      {!hasSeenPreamble ? preambleStep : formStep}
    </ModalGeneric>
  );
}

//
