import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { TimelineCard } from '../TimelineCard';
import { CVExperience } from 'src/api/types';
import { formEditExperience } from 'src/components/forms/schemas/formEditExperience';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { sortByDateStart } from 'src/utils';

interface ExperiencesProfileCardProps {
  experiences?: CVExperience[];
  onChange: (updatedExperiences: { experiences: CVExperience[] }) => void;
}

const EXPERIENCE_LIMIT = 5;

export const ExperiencesProfileCard = ({
  experiences = [],
  onChange,
}: ExperiencesProfileCardProps) => {
  const sortedExperiences = sortByDateStart(experiences);
  const [remainingItems, setRemainingItems] = useState<number>();

  useEffect(() => {
    setRemainingItems(EXPERIENCE_LIMIT - experiences.length);
  }, [experiences]);

  return (
    <TimelineCard
      experiences={sortedExperiences}
      dataTestId="cv-experiences"
      onChange={onChange}
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      remainingItems={remainingItems}
      type="experiences"
      title={
        <>
          Mes <span className="uk-text-primary">expériences</span> et{' '}
          <span className="uk-text-primary">compétences</span>
        </>
      }
      onAdd={() => {
        openModal(
          <ModalEdit
            title="Ajout - Mes expériences et compétences"
            formSchema={formEditExperience}
            onSubmit={async (fields, closeModal) => {
              closeModal();
              await onChange({
                experiences: [
                  ...sortedExperiences,
                  {
                    ...fields,
                    dateStart: fields.dateStart
                      ? moment(fields.dateStart).toDate()
                      : null,
                    dateEnd: fields.dateEnd
                      ? moment(fields.dateEnd).toDate()
                      : null,
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
        title: 'Édition - Mes expériences et compétences',
        formSchema: formEditExperience,
      }}
    />
  );
};
