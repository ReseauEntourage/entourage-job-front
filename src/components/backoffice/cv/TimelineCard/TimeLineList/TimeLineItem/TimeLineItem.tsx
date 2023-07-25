import React from 'react'
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import { formatParagraph } from 'src/utils';
import { SortableElement } from 'react-sortable-hoc';
import { Grid, ButtonIcon } from 'src/components/utils';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { H6 } from 'src/components/utils/Headings';
import moment from 'moment';

export const TimeLineItem = SortableElement(
    ({ value, sortIndex, items, onChange, updateOrder, editProps }) => {
    
        // map the fields
        if (value.company) {
            value.institution = value.company
        }

      return (
        <li style={{ cursor: 'move', listStyleType: 'none' }}>
          <Grid
            eachWidths={['expand', 'auto']}
            className="uk-margin-medium-bottom"
            style={{
              overflowWrap: 'anywhere',
            }}
          >
            <>
                <H6 title={value.title} />
                <p>{value.institution} - {value.location}</p>
                {value.dateStart && <p>{moment(value.dateStart).format('DD/MM/YYYY')} {value.dateEnd && `- ${moment(value.dateEnd).format('DD/MM/YYYY')}`}</p>}
              <p className="uk-margin-small-top uk-margin-small">
                {formatParagraph(value.description)}
              </p>
              {value.skills && (
                <p className="uk-text-primary">
                  {value.skills.map(({ name }, key) => {
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
                            experiences: items,
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
                          const experiencesToSort = [...items];
                          experiencesToSort.splice(sortIndex, 1);
                          updateOrder(experiencesToSort);
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
    }
  );
