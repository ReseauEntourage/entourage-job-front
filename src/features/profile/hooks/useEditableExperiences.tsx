import { useCallback } from 'react';

import type { Experience } from '@/src/api/types';
import { openModal } from '@/src/features/modals/Modal';
import { ProfileExperiencesModalEdit } from '@/src/features/profile/ProfilePartCards/ProfileExperiences/ProfileExperiencesModalEdit/ProfileExperiencesModalEdit';
import {
  buildExperienceFromModalValues,
  removeAtIndex,
  removeById,
  replaceAtIndex,
  upsertById,
} from '@/src/features/profile/utils/experienceFormation.utils';

type SharedOptions = {
  includeSkillId: boolean;
};

export const useEditableExperiencesById = ({
  experiences,
  onChange,
  includeSkillId,
}: {
  experiences: Experience[];
  onChange: (next: Experience[]) => void;
} & SharedOptions) => {
  const editExperience = useCallback(
    (id?: string) => {
      const experience = id
        ? (experiences.find((exp) => exp.id === id) as Experience | undefined)
        : undefined;

      openModal(
        <ProfileExperiencesModalEdit
          experience={experience}
          dispatchOnSubmit={(values) => {
            const nextExperience = buildExperienceFromModalValues(values, {
              id,
              base: experience,
              includeSkillId,
            });

            onChange(upsertById(experiences, nextExperience));
          }}
        />
      );
    },
    [experiences, includeSkillId, onChange]
  );

  const deleteExperience = useCallback(
    (id?: string) => {
      onChange(removeById(experiences, id));
    },
    [experiences, onChange]
  );

  return {
    addExperience: () => editExperience(undefined),
    editExperience,
    deleteExperience,
  };
};

export const useEditableExperiencesByIndex = ({
  experiences,
  onChange,
  includeSkillId,
}: {
  experiences: Experience[];
  onChange: (next: Experience[]) => void;
} & SharedOptions) => {
  const addExperience = useCallback(() => {
    openModal(
      <ProfileExperiencesModalEdit
        dispatchOnSubmit={(values) => {
          const nextExperience = buildExperienceFromModalValues(values, {
            includeSkillId,
          });

          onChange([...experiences, nextExperience]);
        }}
      />
    );
  }, [experiences, includeSkillId, onChange]);

  const editExperience = useCallback(
    (index: number) => {
      const experience = experiences[index];

      openModal(
        <ProfileExperiencesModalEdit
          experience={experience}
          dispatchOnSubmit={(values) => {
            const nextExperience = buildExperienceFromModalValues(values, {
              base: experience,
              includeSkillId,
            });

            onChange(replaceAtIndex(experiences, index, nextExperience));
          }}
        />
      );
    },
    [experiences, includeSkillId, onChange]
  );

  const deleteExperience = useCallback(
    (index: number) => {
      onChange(removeAtIndex(experiences, index));
    },
    [experiences, onChange]
  );

  return {
    addExperience,
    editExperience,
    deleteExperience,
  };
};
