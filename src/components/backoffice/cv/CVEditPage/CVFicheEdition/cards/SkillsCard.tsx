import React from 'react';
import { formEditSkills } from 'src/components/forms/schemas/formEditSkills';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Card } from 'src/components/utils';

interface Skill {
  name: string;
  order: number;
}
interface SkillsCardProps {
  list: Skill[];
  onChange: (updatedSkills: { skills: Skill[] }) => void;
}
export const SkillsCard = ({ list = [], onChange }: SkillsCardProps) => {
  return (
    <Card
      title="Mes atouts"
      editCallback={
        onChange
          ? () =>
              openModal(
                <ModalEdit
                  title="Édition - Mes atouts"
                  formSchema={formEditSkills}
                  defaultValues={{
                    skills: list.map(({ name }) => ({
                      label: name,
                      value: name,
                    })),
                  }}
                  onSubmit={async ({ skills }, closeModal) => {
                    closeModal();
                    const fieldsTransform = {
                      skills: skills.map(({ value }, index) => {
                        return {
                          name: value,
                          order: index,
                        };
                      }),
                    };
                    await onChange(fieldsTransform);
                  }}
                />
              )
          : undefined
      }
    >
      <ul className="uk-list">
        {list.length !== 0 ? (
          list.map(({ name }, i) => {
            return (
              <li
                id={i.toString()}
                key={i}
                data-testid={`cv-edit-skill${i + 1}-content`}
              >
                {name}
              </li>
            );
          })
        ) : (
          <li>Aucun atout renseigné</li>
        )}
      </ul>
    </Card>
  );
};
