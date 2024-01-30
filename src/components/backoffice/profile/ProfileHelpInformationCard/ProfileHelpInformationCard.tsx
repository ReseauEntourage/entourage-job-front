import React from 'react';
import PlaceholderIllu from 'assets/icons/illu-coeur-mains-ouvertes.svg';
import { ProfilePlaceHolder } from '../ProfilePlaceholder';
import { useSelectedProfile } from '../useSelectedProfile';
import { useHelpField } from 'src/components/backoffice/parametres/useUpdateProfile';
import { useContextualRole } from 'src/components/backoffice/useContextualRole';
import { Card } from 'src/components/utils';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { isRoleIncluded } from 'src/utils';
import { ProfileHelpList } from './ProfileHelpList';

export const ProfileHelpInformationCard = () => {
  const { selectedProfile } = useSelectedProfile();

  const helpField = useHelpField(selectedProfile?.role);

  const { contextualRole } = useContextualRole(
    // TODO remove check because selectedProfile always exists
    selectedProfile ? selectedProfile.role : USER_ROLES.CANDIDATE
  );

  if (!selectedProfile || !helpField) return null;

  return (
    <Card
      title={
        isRoleIncluded(CANDIDATE_USER_ROLES, selectedProfile.role)
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
