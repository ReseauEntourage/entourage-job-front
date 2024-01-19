import React, { useEffect, useState } from 'react';
import PlaceholderIllu from 'assets/icons/illu-coeur-mains-ouvertes.svg';
import { useHelpField, helpFields } from '../../useUpdateProfile';
import { ParametresPlaceholder } from '../ParametresPlaceholder';
import { ProfileHelpList } from 'src/components/backoffice/profile/ProfileHelpInformationCard/ProfileHelpList';
import { openModal } from 'src/components/modals/Modal';
import { Card } from 'src/components/utils';
import {
  ParametresHelpCardContents,
  ParametresHelpCardTitles,
} from 'src/constants/helps';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { ParametresHelpModal } from './ParametresHelpModal';

const plaholderText = {
  title: {
    [helpFields.HELP_NEEDS]: 'Vous n’avez renseigné aucune demande d’entraide',
    [helpFields.HELP_OFFERS]:
      'Vous n’avez renseigné aucune proposition d’entraide',
  },
  description: {
    [helpFields.HELP_NEEDS]:
      'Grâce à ces informations, nous pourrons vous mettre en contact avec des coachs qui pourraient vous accompagner.',
    [helpFields.HELP_OFFERS]:
      'Grâce à ces informations, nous pourrons vous mettre en contact avec des candidats que vous pourrez accompagner.',
  },
} as const;

export const ParametresHelpCard = () => {
  const user = useAuthenticatedUser();

  const { role, userProfile } = user;

  const helpField = useHelpField(user.role);

  const [contextualRole, setContextualRole] = useState(role);
  useEffect(() => {
    setContextualRole(role === 'Candidat externe' ? 'Candidat' : role);
  }, [role]);

  const openHelpEditModal = () => {
    openModal(
      <ParametresHelpModal
        role={contextualRole}
        title={ParametresHelpCardTitles.modal[contextualRole.toLowerCase()]}
      />
    );
  };

  if (!helpField || !userProfile) return null;

  return (
    <Card
      title={ParametresHelpCardTitles.card[contextualRole.toLowerCase()]}
      editCallback={openHelpEditModal}
      isMobileClosable
      dataTestId="parametres-help-card"
    >
      {userProfile[helpField].length > 0 ? (
        <ProfileHelpList
          helpList={userProfile[helpField]}
          role={contextualRole}
        />
      ) : (
        <ParametresPlaceholder
          image={<PlaceholderIllu />}
          title={plaholderText.title[helpField]}
          description={plaholderText.description[helpField]}
          onClick={openHelpEditModal}
        />
      )}
    </Card>
  );
};
