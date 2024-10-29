import React from 'react';
import PlaceholderIllu from 'assets/icons/illu-coeur-mains-ouvertes.svg';
import { ProfilePlaceHolder } from '../ProfilePlaceholder';
import { useSelectSelectedProfile } from '../useSelectedProfile';
import { useHelpField } from 'src/components/backoffice/parametres/useUpdateProfile';
import { useContextualRole } from 'src/components/backoffice/useContextualRole';
import { Card } from 'src/components/utils';
import { USER_ROLES } from 'src/constants/users';
import { ProfileHelpList } from './ProfileHelpList';

export const ProfileHelpInformationCard = () => {
  const selectedProfile = useSelectSelectedProfile();

  const { contextualRole } = useContextualRole(selectedProfile.role);
  const helpField = useHelpField(contextualRole);

  if (!helpField) return null;

  return (
    <Card
      title={
        selectedProfile.role === USER_ROLES.CANDIDATE
          ? "Le candidat aurait besoin d'aide pour..."
          : 'Propositions de coups de pouce'
      }
    >
      {selectedProfile[helpField].length > 0 ? (
        <ProfileHelpList
          helpList={selectedProfile[helpField]}
          role={contextualRole}
        />
      ) : (
        <ProfilePlaceHolder
          image={<PlaceholderIllu />}
          description="Ces informations n’ont pas encore été renseigné"
        />
      )}
    </Card>
  );
};
