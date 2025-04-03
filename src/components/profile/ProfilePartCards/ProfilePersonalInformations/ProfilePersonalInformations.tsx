import React, { useCallback } from 'react';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { ProfilePartCard } from '../Card/Card/Card';
import { BusinessSector, Occupation } from 'src/api/types';
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
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import {
  formatCareerPathSentence,
  formatNetworkBusinessSectors,
} from 'src/utils';

export interface ProfilePersonalInformationsProps {
  isEditable?: boolean;
  occupations: Occupation[];
  businessSectors: BusinessSector[];
  smallCard?: boolean;
}

export const ProfilePersonalInformations = ({
  occupations,
  businessSectors,
  isEditable = false,
  smallCard = false,
}: ProfilePersonalInformationsProps) => {
  const user = useAuthenticatedUser();
  const { userProfile, role } = user;

  const isCompleted = businessSectors.length > 0;

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
            const networkBusinessSectors = formatNetworkBusinessSectors(
              values.businessSectors
            );
            return {
              currentJob: values.currentJob,
              networkBusinessSectors,
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
        occupations={occupations}
        businessSectors={businessSectors}
      />
    </ProfilePartCard>
  );
};
