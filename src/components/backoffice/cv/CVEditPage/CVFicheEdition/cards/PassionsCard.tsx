import React from 'react';
import { formEditPassions } from 'src/components/forms/schemas/formEditPassions';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Card } from 'src/components/utils';

interface Passion {
  name: string;
  order: number;
}

interface PassionProps {
  list: Passion[];
  onChange: (updatedPassions: { passions: Passion[] }) => void;
}
export const PassionsCard = ({ list, onChange }: PassionProps) => {
  return (
    <Card
      title="Mes passions"
      editCallback={onChange ? (
            () => openModal(
              <ModalEdit
                title="Édition - Mes passions"
                formSchema={formEditPassions}
                defaultValues={{
                  passions: list.map(({ name }) => ({
                    label: name,
                    value: name,
                  })),
                }}
                onSubmit={async (fields, closeModal) => {
                  closeModal();
                  const fieldsTransform = {
                    passions: fields.passions.map(({ value }, index) => {
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
      ) : undefined}
    >

      <ul className="uk-list">
        {list.length !== 0 ? (
          list.map(({ name }, i) => {
            return (
              <li id={i.toString()} key={i}>
                {name}
              </li>
            );
          })
        ) : (
          <li>Aucune passion renseignée</li>
        )}
      </ul>
    </Card>
  );
};
