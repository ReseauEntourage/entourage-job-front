import moment from 'moment';
import React from 'react';
import { CVExperience, CVFormation } from 'src/api/types';
import { formEditExperience } from 'src/components/forms/schemas/formEditExperience';
import { formEditFormation } from 'src/components/forms/schemas/formEditFormation';
import { openModal } from 'src/components/modals/Modal';
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Grid, ButtonIcon } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { formatParagraph } from 'src/utils';

interface ItemProps extends CVFormation {
  company?: string;
}

type CVData = {
  formations?: CVFormation[];
  experiences?: CVExperience[];
};

type CVDataUpdate = {
  [type in 'formations' | 'experiences']?: CVData[type];
};

interface TimeLineItemProps {
  value: CVExperience | CVFormation;
  sortIndex: number;
  items: CVExperience[] | CVFormation[];
  onChange: (updatedCV: CVDataUpdate) => void;
  editProps: {
    title: string;
    formSchema: typeof formEditExperience | typeof formEditFormation;
  };
  type: keyof CVData;
}

export const TimeLineItem = ({
  value,
  sortIndex,
  items,
  onChange,
  editProps,
  type,
}: TimeLineItemProps) => {
  let valueToFill;
  if ('company' in value) {
    // value is of type CVExperience
    valueToFill = { ...value, institution: value.company } as ItemProps;
  } else {
    valueToFill = { ...value } as ItemProps;
  }
  return (
    <li style={{ listStyleType: 'none' }}>
      <Grid
        eachWidths={['expand', 'auto']}
        className="uk-margin-medium-bottom"
        style={{
          overflowWrap: 'anywhere',
        }}
      >
        <>
          <H6 title={value.title} />
          <p>
            {valueToFill.institution} - {valueToFill.location}
          </p>
          {value.dateStart && (
            <p>
              {moment(valueToFill.dateStart).format('DD/MM/YYYY')}{' '}
              {valueToFill.dateEnd &&
                `- ${moment(value.dateEnd).format('DD/MM/YYYY')}`}
            </p>
          )}
          <p className="uk-margin-small-top uk-margin-small">
            {formatParagraph(valueToFill.description)}
          </p>
          {valueToFill.skills && (
            <p className="uk-text-primary">
              {valueToFill.skills.map(({ name }, key) => {
                return (
                  <span key={key} className="uk-label uk-margin-small-right">
                    {name}
                  </span>
                );
              })}
            </p>
          )}
        </>
        {onChange && (
          <div className="uk-flex uk-flex-column">
            <ButtonIcon
              name="pencil"
              onClick={() => {
                openModal(
                  <ModalEdit
                    title={editProps.title}
                    formSchema={editProps.formSchema}
                    defaultValues={{
                      ...value,
                      dateStart: moment(value.dateStart).format('YYYY-MM-DD'),
                      dateEnd: moment(value.dateEnd).format('YYYY-MM-DD'),
                      skills: value.skills?.map(({ name }) => {
                        return { value: name, label: name };
                      }),
                    }}
                    onSubmit={async (fields, closeModal) => {
                      closeModal();
                      // Update the items array
                      const updatedItems = [...items];
                      updatedItems[sortIndex] = {
                        ...updatedItems[sortIndex],
                        ...{
                          ...fields,
                          dateStart: moment(fields.dateStart).toDate() as Date,
                          dateEnd: moment(fields.dateEnd).toDate() as Date,
                          skills:
                            Array.isArray(fields.skills) &&
                            fields.skills?.map((skill, i) => {
                              return { name: skill.value, order: i };
                            }),
                        },
                      };

                      // Prepare the update object
                      const update: CVDataUpdate =
                        type === 'formations'
                          ? {
                              formations: updatedItems,
                            }
                          : {
                              experiences: updatedItems,
                            };

                      await onChange(update);
                    }}
                  />
                );
              }}
            />
            <ButtonIcon
              name="trash"
              onClick={() => {
                openModal(
                  <ModalConfirm
                    text="Êtes-vous sûr(e) de vouloir supprimer cet élément ?"
                    buttonText="Supprimer"
                    onConfirm={async () => {
                      const itemsToSort = [...items];
                      itemsToSort.splice(sortIndex, 1);
                      // Prepare the update object
                      const update: CVDataUpdate =
                        type === 'formations'
                          ? {
                              formations: itemsToSort,
                            }
                          : {
                              experiences: itemsToSort,
                            };
                      await onChange(update);
                    }}
                  />
                );
              }}
            />
          </div>
        )}
      </Grid>
    </li>
  );
};
