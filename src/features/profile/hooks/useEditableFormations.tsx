import { useCallback } from 'react';

import type { Formation } from '@/src/api/types';
import { openModal } from '@/src/features/modals/Modal';
import { ProfileFormationsModalEdit } from '@/src/features/profile/ProfilePartCards/ProfileFormations/ProfileFormationsModalEdit/ProfileFormationsModalEdit';
import {
  buildFormationFromModalValues,
  removeAtIndex,
  removeById,
  replaceAtIndex,
  upsertById,
} from '@/src/features/profile/utils/experienceFormation.utils';

type SharedOptions = {
  includeSkillId: boolean;
};

export const useEditableFormationsById = ({
  formations,
  onChange,
  includeSkillId,
}: {
  formations: Formation[];
  onChange: (next: Formation[]) => void;
} & SharedOptions) => {
  const editFormation = useCallback(
    (id?: string) => {
      const formation = id
        ? (formations.find((f) => f.id === id) as Formation | undefined)
        : undefined;

      openModal(
        <ProfileFormationsModalEdit
          formation={formation}
          dispatchOnSubmit={(values) => {
            const nextFormation = buildFormationFromModalValues(values, {
              id,
              base: formation,
              includeSkillId,
            });

            onChange(upsertById(formations, nextFormation));
          }}
        />
      );
    },
    [formations, includeSkillId, onChange]
  );

  const deleteFormation = useCallback(
    (id?: string) => {
      onChange(removeById(formations, id));
    },
    [formations, onChange]
  );

  return {
    addFormation: () => editFormation(undefined),
    editFormation,
    deleteFormation,
  };
};

export const useEditableFormationsByIndex = ({
  formations,
  onChange,
  includeSkillId,
}: {
  formations: Formation[];
  onChange: (next: Formation[]) => void;
} & SharedOptions) => {
  const addFormation = useCallback(() => {
    openModal(
      <ProfileFormationsModalEdit
        dispatchOnSubmit={(values) => {
          const nextFormation = buildFormationFromModalValues(values, {
            includeSkillId,
          });

          onChange([...formations, nextFormation]);
        }}
      />
    );
  }, [formations, includeSkillId, onChange]);

  const editFormation = useCallback(
    (index: number) => {
      const formation = formations[index];

      openModal(
        <ProfileFormationsModalEdit
          formation={formation}
          dispatchOnSubmit={(values) => {
            const nextFormation = buildFormationFromModalValues(values, {
              base: formation,
              includeSkillId,
            });

            onChange(replaceAtIndex(formations, index, nextFormation));
          }}
        />
      );
    },
    [formations, includeSkillId, onChange]
  );

  const deleteFormation = useCallback(
    (index: number) => {
      onChange(removeAtIndex(formations, index));
    },
    [formations, onChange]
  );

  return {
    addFormation,
    editFormation,
    deleteFormation,
  };
};
