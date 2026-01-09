import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SvgIcon } from '@/assets/icons/icons';
import { Text } from '@/src/components/ui';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { CVExperienceOrFormation } from '../../CVExperienceOrFormation/CVExperienceOrFormation';
import { ProfilePartCard } from '../Card/Card/Card';
import { Formation } from 'src/api/types';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import { StyledProfileFormationsList } from './ProfileFormations.styles';
import { ProfileFormationsModalEdit } from './ProfileFormationsModalEdit/ProfileFormationsModalEdit';

export interface ProfileFormationsProps {
  userId: string;
  userFirstName: string;
  userRole: UserRoles;
  formations?: Formation[];
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileFormations = ({
  userId,
  userFirstName,
  userRole,
  formations = [],
  isEditable = false,
  smallCard = false,
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
      <Text>{`${userFirstName} n'a pas encore renseigné ses formations`}</Text>
    );
    return {
      content,
      icon: <SvgIcon name="IlluMalette" />,
    };
  }, [isEditable, userFirstName]);

  const suggestHelpToComplete = useCallback(() => {
    router.push(`/backoffice/messaging?userId=${userId}`);
  }, [router, userId]);

  const editFormation = useCallback(
    (id?: string) => {
      openModal(
        <ProfileFormationsModalEdit
          dispatchOnSubmit={(values) => {
            let newFormations = formations;
            if (id) {
              newFormations = newFormations.filter(
                (formation) => formation.id !== id
              );
            }
            updateUserProfile({
              formations: [
                ...newFormations,
                {
                  id: id || undefined,
                  title: values.title || undefined,
                  location: values.location || undefined,
                  institution: values.institution || undefined,
                  startDate: values.startDate || undefined,
                  endDate: values.endDate || undefined,
                  description: values.description || undefined,
                  skills:
                    values.skills?.map((skill) => ({
                      name: skill.label,
                    })) || [],
                } as Formation,
              ],
            });
          }}
          formation={
            formations.find((formation) => formation.id === id) as Formation
          }
        />
      );
    },
    [formations, updateUserProfile]
  );

  const deleteFormation = useCallback(
    (id?: string) => {
      let newFormations = formations;
      if (id) {
        newFormations = newFormations.filter((exp) => exp.id !== id);
      }
      updateUserProfile({
        formations: newFormations,
      });
    },
    [formations, updateUserProfile]
  );

  const ctaCallback = useCallback(() => {
    if (isEditable) {
      return editFormation();
    }
    if (!isOwnProfile) {
      return suggestHelpToComplete();
    }
    return undefined;
  }, [editFormation, isEditable, isOwnProfile, suggestHelpToComplete]);

  const ctaTitle = useMemo(() => {
    if (!isOwnProfile && !isCompleted && userRole === UserRoles.CANDIDATE) {
      return `Accompagner ${userFirstName} dans la valorisation de ses formations`;
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
      smallCard={smallCard}
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
