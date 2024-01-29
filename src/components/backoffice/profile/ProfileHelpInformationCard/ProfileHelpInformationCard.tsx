import React from 'react';
import PlaceholderIllu from 'assets/icons/illu-coeur-mains-ouvertes.svg';
import { ProfilePlaceHolder } from '../ProfilePlaceholder';
import { useSelectSelectedProfile } from '../useSelectedProfile';
import { useHelpField } from 'src/components/backoffice/parametres/useUpdateProfile';
import { Card } from 'src/components/utils';
import { CANDIDATE_USER_ROLES } from 'src/constants/users';
import { isRoleIncluded } from 'src/utils';
import { ProfileHelpList } from './ProfileHelpList';

export const ProfileHelpInformationCard = () => {
  const selectedProfile = useSelectSelectedProfile();
  const helpField = useHelpField(selectedProfile?.role);

  if (!helpField) return null;
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
          role={selectedProfile.role}
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
