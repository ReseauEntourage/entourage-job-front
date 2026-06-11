import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LucidIcon, Text } from '@/src/components/ui';
import { UserRoles } from '@/src/constants/users';
import { useEditableFormationsById } from '@/src/features/profile/hooks/useEditableFormations';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { CVExperienceOrFormation } from '../../CVExperienceOrFormation/CVExperienceOrFormation';
import { ProfilePartCard } from '../Card/Card/Card';
import { Formation } from 'src/api/types';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import { StyledProfileFormationsList } from './ProfileFormations.styles';

interface ProfileFormationsProps {
  userId: string;
  userFirstName: string;
  userRole: UserRoles;
  formations?: Formation[];
  isEditable?: boolean;
}

export const ProfileFormations = ({
  userId,
  userFirstName,
  userRole,
  formations = [],
  isEditable = false,
}: ProfileFormationsProps) => {
  const user = useAuthenticatedUser();
  const currentUserId = useSelector(selectCurrentUserId);
  const router = useRouter();
  const { updateUserProfile } = useUpdateProfile(user);

  const isOwnProfile = userId === currentUserId;
  const isCompleted = formations.length > 0;

  const fallback = useMemo(() => {
    const content = isEditable ? (
      <Text>Vous n’avez pas encore renseigné vos formations</Text>
    ) : (
      <>
        <Text weight="bold">{`${userFirstName} n'a pas encore renseigné ses formations`}</Text>
        <Text>
          Certains candidats n&apos;ont pas les codes ou ne savent pas par où
          commencer pour remplir cette section. Votre coup de pouce peut tout
          débloquer.
        </Text>
      </>
    );
    return {
      content,
      icon: !isEditable ? <LucidIcon name="MessageSquare" /> : null,
    };
  }, [isEditable, userFirstName]);

  const suggestHelpToComplete = useCallback(() => {
    router.push(`/backoffice/messaging?userId=${userId}`);
  }, [router, userId]);

  const { addFormation, editFormation, deleteFormation } =
    useEditableFormationsById({
      formations,
      includeSkillId: false,
      onChange: (nextFormations) => {
        updateUserProfile({ formations: nextFormations });
      },
    });

  const ctaCallback = useCallback(() => {
    if (isEditable) {
      return addFormation();
    }
    if (!isOwnProfile) {
      return suggestHelpToComplete();
    }
    return undefined;
  }, [addFormation, isEditable, isOwnProfile, suggestHelpToComplete]);

  const ctaTitle = useMemo(() => {
    if (!isOwnProfile && !isCompleted && userRole === UserRoles.CANDIDATE) {
      return `Échanger avec ${userFirstName}`;
    }
    if (isOwnProfile && isEditable) {
      return 'Ajouter';
    }
    return null;
  }, [isOwnProfile, isCompleted, userRole, isEditable, userFirstName]);

  return (
    <ProfilePartCard
      title="Formations"
      isCompleted={isCompleted}
      isEditable={isEditable}
      // iaGenerated
      fallback={fallback}
      ctaTitle={ctaTitle}
      ctaCallback={ctaCallback}
    >
      <StyledProfileFormationsList>
        {formations.map((formation: Formation) => {
          return (
            <CVExperienceOrFormation
              key={formation.id}
              title={formation.title}
              description={formation.description}
              startDate={formation.startDate}
              endDate={formation.endDate}
              location={formation.location}
              structure={formation.institution}
              skills={formation.skills}
              variant="timeline"
              isEditable={isEditable}
              editItem={() => editFormation(formation.id)}
              deleteItem={() => deleteFormation(formation.id)}
            />
          );
        })}
      </StyledProfileFormationsList>
    </ProfilePartCard>
  );
};
