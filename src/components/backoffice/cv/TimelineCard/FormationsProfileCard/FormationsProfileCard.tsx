import React from 'react';

import { TimelineCard } from '../TimelineCard';
import { CVFormation } from 'src/api/types';
import schemaformEditFormation from 'src/components/forms/schema/formEditFormation.json';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { sortByOrder } from 'src/utils';

interface FormationProfileCardProps {
  formations: CVFormation[];
  onChange: (arg1: any) => void;
}

export const FormationsProfileCard = ({
  formations,
  onChange,
}: FormationProfileCardProps) => {
  const sortedFormations = sortByOrder(formations);

  return (
    <TimelineCard
      experiences={sortedFormations}
      onChange={onChange}
      title={
        <>
          Mes <span className="uk-text-primary">formations</span>
        </>
      }
      onAdd={() => {
        openModal(
          <ModalEdit
            title="Ajout -Mes formations"
            formSchema={schemaformEditFormation}
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
                        name: skill,
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
        formSchema: schemaformEditFormation,
      }}
    />
  );
};
