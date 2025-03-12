import React, { useCallback } from 'react';
import { ProfilePartCard } from '../Card/Card/Card';
import { ModalEditProfessionalInformation } from 'src/components/backoffice/parametres-old/ParametresLayout/ProfessionalInformationCard/ModalEditProfessionalInformation';
import {
  getCandidateDefaultProfessionalValues,
  getCoachDefaultProfessionalValues,
} from 'src/components/backoffice/parametres-old/ParametresLayout/ProfessionalInformationCard/ProfessionalInformationCard.utils';
import { ProfileCareerPathSentence } from 'src/components/backoffice/profile/ProfileProfessionalInformationCard/ProfileCareerPathSentence';
import { formEditCandidateProfessionalInformation } from 'src/components/forms/schemas/formEditCandidateProfessionalInformation';
import { formEditCoachProfessionalInformation } from 'src/components/forms/schemas/formEditCoachProfessionalInformation';
import { openModal } from 'src/components/modals/Modal';
import { AmbitionsPrefixesType } from 'src/constants';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import {
  formatCareerPathSentence,
  formatNetworkBusinessLines,
} from 'src/utils';

type Ambition = {
  name: string;
  order: number;
  prefix: AmbitionsPrefixesType;
};

type BusinessLine = {
  name: string;
  order: number;
};

export interface ProfilePersonalInformationsProps {
  isEditable?: boolean;
  ambitions: Ambition[];
  businessLines: BusinessLine[];
}

export const ProfilePersonalInformations = ({
  ambitions,
  businessLines,
  isEditable = false,
}: ProfilePersonalInformationsProps) => {
  const user = useAuthenticatedUser();
  const { userProfile, role } = user;

  const isCompleted = businessLines.length > 0;

  const editModal = useCallback(() => {
    if (!userProfile) return;
    openModal(
      role === USER_ROLES.COACH ? (
        <ModalEditProfessionalInformation
          title="Renseignez votre métier et les secteurs dans lesquels vous avez du réseau"
          description=""
          user={user}
          defaultValues={getCoachDefaultProfessionalValues(userProfile)}
          formSchema={formEditCoachProfessionalInformation}
          getValuesToSend={(values) => {
            const networkBusinessLines = formatNetworkBusinessLines(
              values.networkBusinessLines
            );
            return {
              currentJob: values.currentJob,
              networkBusinessLines,
              linkedinUrl: values.linkedinUrl,
            };
          }}
        />
      ) : (
        <ModalEditProfessionalInformation
          title="Renseignez votre projet professionnel"
          description="Nous vous mettrons en relation avec des professionnels qui pourront vous aider"
          defaultValues={getCandidateDefaultProfessionalValues(userProfile)}
          formSchema={formEditCandidateProfessionalInformation}
          user={user}
          getValuesToSend={(values) => {
            return {
              ...formatCareerPathSentence(values),
              linkedinUrl: values.linkedinUrl,
            };
          }}
        />
      )
    );
  }, [userProfile, role, user]);

  return (
    <ProfilePartCard
      title="Informations personnelles"
      isCompleted={isCompleted}
      isEditable={isEditable}
      editCallback={editModal}
    >
      <ProfileCareerPathSentence
        ambitions={ambitions}
        businessLines={businessLines}
      />
    </ProfilePartCard>
  );
};
