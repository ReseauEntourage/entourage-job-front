import React, { useCallback } from 'react';
import PlaceholderIllu from 'assets/icons/illu-coeur-mains-ouvertes.svg';
import { helpFields, useHelpField } from '../../useUpdateProfile';
import { ParametresPlaceholder } from '../ParametresPlaceholder';
import { ProfileHelpList } from 'src/components/backoffice/profile/ProfileHelpInformationCard/ProfileHelpList';
import { useContextualRole } from 'src/components/backoffice/useContextualRole';
import { openModal } from 'src/components/modals/Modal';
import { Card } from 'src/components/utils';
import { ParametresHelpCardTitles } from 'src/constants/helps';
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
  const { contextualRole } = useContextualRole(role);
  const helpField = useHelpField(contextualRole);

  const openHelpEditModal = useCallback(() => {
    if (contextualRole) openModal(
      <ParametresHelpModal
        role={contextualRole}
        title={ParametresHelpCardTitles.modal[contextualRole]}
      />
    );
  }, [contextualRole]);

  if (!helpField || !userProfile || !contextualRole) return null;

  return (
    <Card
      title={ParametresHelpCardTitles.card[contextualRole]}
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
