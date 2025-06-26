import React, { useCallback } from 'react';
import { UserRoles } from '@/src/constants/users';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { UserProfileSectorOccupation } from 'src/api/types';
import { ModalEditProfessionalInformation } from 'src/components/backoffice/parametres-old/ParametresLayout/ProfessionalInformationCard/ModalEditProfessionalInformation';
import {
  getCandidateDefaultProfessionalValues,
  getCoachDefaultProfessionalValues,
} from 'src/components/backoffice/parametres-old/ParametresLayout/ProfessionalInformationCard/ProfessionalInformationCard.utils';
import { ProfileCareerPathSentence } from 'src/components/backoffice/profile/ProfileProfessionalInformationCard/ProfileCareerPathSentence';
import { formEditCandidateProfessionalInformation } from 'src/components/forms/schemas/formEditCandidateProfessionalInformation';
import { formEditCoachProfessionalInformation } from 'src/components/forms/schemas/formEditCoachProfessionalInformation';
import { openModal } from 'src/components/modals/Modal';
import { Text } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { formatCareerPathSentence } from 'src/utils';

export interface ParamProfessionalInformationsProps {
  isEditable?: boolean;
  sectorOccupations: UserProfileSectorOccupation[];
  smallCard?: boolean;
}

export const ParamProfessionalInformations = ({
  sectorOccupations,
  isEditable = false,
  smallCard = false,
}: ParamProfessionalInformationsProps) => {
  const user = useAuthenticatedUser();
  const { userProfile, role } = user;

  const isCompleted = sectorOccupations?.length > 0;

  const editModal = useCallback(() => {
    if (!userProfile) return;
    openModal(
      role === UserRoles.COACH ? (
        <ModalEditProfessionalInformation
          title="Renseignez votre métier et les secteurs dans lesquels vous avez du réseau"
          description=""
          user={user}
          defaultValues={getCoachDefaultProfessionalValues(userProfile)}
          formSchema={formEditCoachProfessionalInformation}
          getValuesToSend={(values) => {
            return {
              currentJob: values.currentJob,
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
          getValuesToSend={(values) => ({
            sectorOccupations: formatCareerPathSentence(values),
            linkedinUrl: values.linkedinUrl,
          })}
        />
      )
    );
  }, [userProfile, role, user]);

  return (
    <ProfilePartCard
      title="Informations professionnelles"
      isCompleted={isCompleted}
      isEditable={isEditable}
      ctaCallback={editModal}
      smallCard={smallCard}
      fallback={{
        content: (
          <>
            <H6 title="Renseignez ici les secteurs et métiers que vous recherchez" />
            <Text>
              Ces informations nous permettent de vous mettre en relation plus
              facilement avec des personnes de la communauté qui pourraient vous
              donner un coup de pouce{' '}
            </Text>
          </>
        ),
        icon: <IlluBulleQuestion />,
      }}
    >
      <ProfileCareerPathSentence
        sectorOccupations={sectorOccupations}
        role={role}
        currentJob={userProfile?.currentJob || undefined}
      />
    </ProfilePartCard>
  );
};
