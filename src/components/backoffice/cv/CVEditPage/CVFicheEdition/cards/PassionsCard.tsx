import React from 'react';
import { formEditPassions } from 'src/components/forms/schemas/formEditPassions';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Grid, ButtonIcon, Icon } from 'src/components/utils';

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
          {!onChange && (
            <span className="uk-margin-small-right">
              <Icon name="heart" />
            </span>
          )}
          Mes <span className="uk-text-primary">passions</span>
        </h3>
        {onChange && (
          <ButtonIcon
            name="pencil"
            onClick={() => {
              openModal(
                <ModalEdit
                  title="Édition - Mes passions (6 maximum)"
                  formSchema={formEditPassions}
                  defaultValues={list.reduce((acc, { name }, i) => {
                    acc[`passion${i + 1}`] = name;
                    return acc;
                  }, {})}
                  onSubmit={async (fields, closeModal) => {
                    closeModal();
                    const fieldsTransform = {
                      passions: Object.values(fields)
                        .filter((val) => {
                          return !!val;
                        })
                        .map((val, index) => {
                          return {
                            name: val,
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
