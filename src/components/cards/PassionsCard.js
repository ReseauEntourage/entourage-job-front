import React from 'react';
import PropTypes from 'prop-types';
import { Grid, ButtonIcon } from 'src/components/utils';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import schemaformEditPassions from 'src/components/forms/schema/formEditPassions.json';
import { IconNoSSR } from 'src/components/utils/Icon';
import { openModal } from 'src/components/modals/Modal';

export const PassionsCard = ({ list, onChange }) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <Grid gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          {!onChange && (
            <span className="uk-margin-small-right">
              <IconNoSSR name="heart" />
            </span>
          )}
          Mes passions
        </h3>
        {onChange && (
          <ButtonIcon
            name="pencil"
            onClick={() => {
              openModal(
                <ModalEdit
                  id="modal-passions"
                  title="Édition - Mes passions (6 maximum)"
                  formSchema={schemaformEditPassions}
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
                        .map((val) => {
                          return {
                            name: val,
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
              <li id={i} key={i}>
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
PassionsCard.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ),
  onChange: PropTypes.func,
};
PassionsCard.defaultProps = {
  list: [],
  onChange: null,
};
