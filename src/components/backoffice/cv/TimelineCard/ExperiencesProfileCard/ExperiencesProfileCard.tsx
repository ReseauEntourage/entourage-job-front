import React from 'react';
import { TimelineCard } from '../TimelineCard';
import { CVExperience } from 'src/api/types';
import schemaformEditExperience from 'src/components/forms/schema/formEditExperience.json';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { sortByOrder } from 'src/utils';

interface ExperiencesProfileCardProps {
  experiences: CVExperience[];
  onChange: (arg1: any) => void;
}

export const ExperiencesProfileCard = ({
  experiences,
  onChange,
}: ExperiencesProfileCardProps) => {
  const sortedExperiences = sortByOrder(experiences);

  return (
    <TimelineCard
      experiences={sortedExperiences}
      onChange={onChange}
      title={
        <>
          Mes <span className="uk-text-primary">expériences</span> et{' '}
          <span className="uk-text-primary">compétences</span>
        </>
      }
      onAdd={() => {
        openModal(
          <ModalEdit
            title="Ajout -Mes expériences et compétences"
            formSchema={schemaformEditExperience}
            onSubmit={async (fields, closeModal) => {
              closeModal();
              await onChange({
                experiences: [
                  ...sortedExperiences,
                  {
                    ...fields,
                    order:
                      (experiences.reduce((acc, val) => {
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
        title: 'Édition - Mes expériences et compétences',
        formSchema: schemaformEditExperience,
      }}
    />
  );
};
