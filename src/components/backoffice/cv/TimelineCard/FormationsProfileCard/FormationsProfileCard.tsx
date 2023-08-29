import React, { useEffect, useState } from 'react';

import { TimelineCard } from '../TimelineCard';
import { CV, CVFormation } from 'src/api/types';
import { formEditFormation } from 'src/components/forms/schemas/formEditFormation';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { sortByDateStart } from 'src/utils';

interface FormationProfileCardProps {
  formations: CVFormation[];
  onChange: (arg1: Partial<CV>) => void;
}

export const FormationsProfileCard = ({
  formations,
  onChange,
}: FormationProfileCardProps) => {
  const sortedFormations = sortByDateStart(formations);
  const [remainingItems, setRemainingItems] = useState<number>();

  useEffect(() => {
    setRemainingItems(3 - formations.length);
  }, [formations]);

  return (
    <TimelineCard
      experiences={sortedFormations}
      onChange={onChange}
      remainingItems={remainingItems}
      type="formations"
      title={
        <>
          Mes <span className="uk-text-primary">formations</span>
        </>
      }
      onAdd={() => {
        openModal(
          <ModalEdit
            title="Ajout -Mes formations"
            formSchema={formEditFormation}
            onSubmit={async (fields, closeModal) => {
              closeModal();
              await onChange({
                formations: [
                  ...sortedFormations,
                  {
                    ...fields,
                    order:
                      (formations.reduce((acc, val) => {
                        return acc === undefined ||
                          (typeof acc === 'number' && val.order > acc)
                          ? val.order
                          : acc;
                      }, []) as number) + 1,
                    skills: fields.skills?.map((skill) => {
                      return {
                        name: skill.value,
                      };
                    }),
                  },
                ],
              });
            }}
          />
        );
      }}
      editProps={{
        title: 'Édition - Mes formations',
        formSchema: formEditFormation,
      }}
    />
  );
};
