import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { TimelineCard } from '../TimelineCard';
import { CVFormation } from 'src/api/types';
import { formEditFormation } from 'src/components/forms/schemas/formEditFormation';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { sortByDateStart } from 'src/utils';

interface FormationProfileCardProps {
  formations?: CVFormation[];
  onChange: (updatedFormations: { formations: CVFormation[] }) => void;
}

const FORMATIONS_LIMIT = 3;

export const FormationsProfileCard = ({
  formations = [],
  onChange,
}: FormationProfileCardProps) => {
  const [remainingItems, setRemainingItems] = useState<number>();
  const [sortedFormations, setSortedFormations] = useState<CVFormation[]>(
    sortByDateStart(formations)
  );
  useEffect(() => {
    setSortedFormations(sortByDateStart(formations));
  }, [formations]);

  useEffect(() => {
    setRemainingItems(FORMATIONS_LIMIT - formations.length);
  }, [formations]);

  return (
    <TimelineCard
      experiences={sortedFormations}
      dataTestId="cv-formations"
      onChange={onChange}
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
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
                  // @ts-expect-error after enable TS strict mode. Please, try to fix it
                  ...sortedFormations,
                  {
                    ...fields,

                    // @ts-expect-error after enable TS strict mode. Please, try to fix it
                    dateStart: fields.dateStart
                      ? moment(fields.dateStart).toDate()
                      : null,

                    // @ts-expect-error after enable TS strict mode. Please, try to fix it
                    dateEnd: fields.dateEnd
                      ? moment(fields.dateEnd).toDate()
                      : null,
                    skills: fields.skills?.map((skill, i) => {
                      return {
                        name: skill.value,
                        order: i,
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
