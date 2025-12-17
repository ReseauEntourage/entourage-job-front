import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SvgIcon } from '@/assets/icons/icons';
import { openModal } from '@/src/components/modals/Modal';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { CVExperienceOrFormation } from '../../CVExperienceOrFormation/CVExperienceOrFormation';
import { ProfilePartCard } from '../Card/Card/Card';
import { Experience } from 'src/api/types';
import { Text } from 'src/components/utils';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import { StyledProfileExperiencesList } from './ProfileExperiences.styles';
import { ProfileExperiencesModalEdit } from './ProfileExperiencesModalEdit/ProfileExperiencesModalEdit';

export interface ProfileExperiencesProps {
  userId: string;
  userFirstName: string;
  userRole: UserRoles;
  experiences?: Experience[];
  isEditable?: boolean;
  smallCard?: boolean;
}

export const ProfileExperiences = ({
  userId,
  userFirstName,
  userRole,
  experiences = [],
  isEditable = false,
  smallCard = false,
}: ProfileExperiencesProps) => {
  const currentUserId = useSelector(selectCurrentUserId);
  const user = useAuthenticatedUser();
  const router = useRouter();
  const { updateUserProfile } = useUpdateProfile(user);

  const isOwnProfile = userId === currentUserId;
  const isCompleted = experiences.length > 0;

  const editableFallback = useMemo(() => {
    if (user.role === UserRoles.CANDIDATE) {
      return (
        <Text>
          Vous n’avez pas encore renseigné d’expérience professionnelle. Si vous
          avez de l&apos;expérience, nous vous invitons à la partager. Elle est
          essentielle pour nos coachs et pour les recruteurs.
        </Text>
      );
    }
    return (
      <Text>
        Vous n’avez pas encore renseigné d’expérience professionnelle. Si vous
        avez de l&apos;expérience, nous vous invitons à la partager.
      </Text>
    );
  }, [user.role]);

  const fallback = useMemo(() => {
    const content = isEditable ? (
      editableFallback
    ) : (
      <Text>{`${userFirstName} n’a pas encore renseigné ses expériences professionnelles`}</Text>
    );
    return {
      content,
      icon: <SvgIcon name="IlluMalette" />,
    };
  }, [editableFallback, isEditable, userFirstName]);

  const suggestHelpToComplete = useCallback(() => {
    router.push(`/backoffice/messaging?userId=${userId}`);
  }, [router, userId]);

  const editExperience = useCallback(
    (id?: string) => {
      openModal(
        <ProfileExperiencesModalEdit
          dispatchOnSubmit={(values) => {
            let newExperiences = experiences;
            if (id) {
              newExperiences = newExperiences.filter((exp) => exp.id !== id);
            }
            updateUserProfile({
              experiences: [
                ...newExperiences,
                {
                  id: id || undefined,
                  title: values.title || undefined,
                  location: values.location || undefined,
                  company: values.company || undefined,
                  startDate: values.startDate || undefined,
                  endDate: values.endDate || undefined,
                  description: values.description || undefined,
                  skills:
                    values.skills?.map((skill) => ({
                      name: skill.label,
                    })) || [],
                } as Experience,
              ],
            });
          }}
          experience={experiences.find((exp) => exp.id === id) as Experience}
        />
      );
    },
    [experiences, updateUserProfile]
  );

  const deleteExperience = useCallback(
    (id?: string) => {
      let newExperiences = experiences;
      if (id) {
        newExperiences = newExperiences.filter((exp) => exp.id !== id);
      }
      updateUserProfile({
        experiences: newExperiences,
      });
    },
    [experiences, updateUserProfile]
  );

  const ctaCallback = useCallback(() => {
    if (isEditable) {
      return editExperience();
    }
    if (!isOwnProfile) {
      return suggestHelpToComplete();
    }
    return undefined;
  }, [editExperience, isEditable, isOwnProfile, suggestHelpToComplete]);

  const ctaTitle = useMemo(() => {
    if (!isOwnProfile && !isCompleted && userRole === UserRoles.CANDIDATE) {
      return `Accompagner ${userFirstName} dans la valorisation de ses expériences`;
    }
    if (isOwnProfile && isEditable) {
      return 'Ajouter';
    }
    return null;
  }, [isOwnProfile, isCompleted, userRole, isEditable, userFirstName]);

  return (
    <ProfilePartCard
      title="Expériences"
      isCompleted={isCompleted}
      isEditable={isEditable}
      // iaGenerated
      smallCard={smallCard}
      fallback={fallback}
      ctaTitle={ctaTitle}
      ctaCallback={ctaCallback}
    >
      <StyledProfileExperiencesList>
        {experiences.map((experience: Experience) => {
          return (
            <CVExperienceOrFormation
              key={experience.id}
              title={experience.title}
              description={experience.description}
              startDate={experience.startDate}
              endDate={experience.endDate}
              location={experience.location}
              structure={experience.company}
              skills={experience.skills}
              isEditable={isEditable}
              editItem={() => editExperience(experience.id)}
              deleteItem={() => deleteExperience(experience.id)}
            />
          );
        })}
      </StyledProfileExperiencesList>
    </ProfilePartCard>
  );
};
