import React from 'react';
import PencilIcon from 'assets/icons/pencil.svg';
import { formEditPassions } from 'src/components/forms/schemas/formEditPassions';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Grid, ButtonIcon } from 'src/components/utils';

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
    <div className="uk-card uk-card-default uk-card-body">
      <Grid gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          Mes <span className="uk-text-primary">passions</span>
        </h3>
        {onChange && (
          <ButtonIcon
            icon={<PencilIcon />}
            onClick={() => {
              openModal(
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
              );
            }}
          />
        )}
      </Grid>
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
    </div>
  );
};
