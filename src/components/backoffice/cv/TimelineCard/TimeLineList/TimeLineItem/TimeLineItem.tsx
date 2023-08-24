import moment from 'moment';
import React from 'react';
import { CVExperience, CVFormation } from 'src/api/types';
import { openModal } from 'src/components/modals/Modal';
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Grid, ButtonIcon } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { formatParagraph } from 'src/utils';
import { AnyCantFix } from 'src/utils/Types';

interface ItemProps extends CVFormation {
  company: string;
}

interface TimeLineItem {
  value: CVExperience | CVFormation;
  sortIndex: number;
  items: CVExperience[] | CVFormation[];
  onChange: (arg1: any) => void;
  editProps: {
    title: string;
    formSchema: AnyCantFix;
  };
}

export const TimeLineItem = ({
  value,
  sortIndex,
  items,
  onChange,
  editProps,
}: TimeLineItem) => {
  let valueToFill;
  let itemType;
  if ('company' in value) {
    // value is of type CVExperience
    valueToFill = { ...value, institution: value.company } as ItemProps;
    itemType = 'experiences';
  } else {
    valueToFill = { ...value } as ItemProps;
    itemType = 'formations';
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
                      skills: value.skills?.map(({ name }) => {
                        return name;
                      }),
                    }}
                    onSubmit={async (fields, closeModal) => {
                      closeModal();
                      items[sortIndex] = {
                        ...items[sortIndex],
                        ...{
                          ...fields,
                          skills: fields.skills?.map((skill) => {
                            return { name: skill };
                          }),
                        },
                      };
                      await onChange({
                        [itemType]: items,
                      });
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
                    onConfirm={() => {
                      const itemsToSort = [...items];
                      itemsToSort.splice(sortIndex, 1);
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
