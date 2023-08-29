import React, { useEffect, useState } from 'react';
import { TimelineCard } from '../TimelineCard';
import { CV, CVExperience } from 'src/api/types';
import { formEditExperience } from 'src/components/forms/schemas/formEditExperience';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { sortByDateStart } from 'src/utils';

interface ExperiencesProfileCardProps {
  experiences: CVExperience[];
  onChange: (arg1: Partial<CV>) => void;
}

export const ExperiencesProfileCard = ({
  experiences,
  onChange,
}: ExperiencesProfileCardProps) => {
  const sortedExperiences = sortByDateStart(experiences);
  const [remainingItems, setRemainingItems] = useState<number>();

  useEffect(() => {
    setRemainingItems(5 - experiences.length);
  }, [experiences]);

  return (
    <TimelineCard
      experiences={sortedExperiences}
      onChange={onChange}
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
        title: 'Édition - Mes expériences et compétences',
        formSchema: formEditExperience,
      }}
    />
  );
};
