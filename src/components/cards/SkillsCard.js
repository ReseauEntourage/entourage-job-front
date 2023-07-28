import PropTypes from 'prop-types';
import React from 'react';
import { formEditSkills } from 'src/components/forms/schema/formEditSkills';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Grid, ButtonIcon, Icon } from 'src/components/utils';

export const SkillsCard = ({ list, onChange }) => {
  return (
    <div className="uk-card uk-card-secondary uk-card-body">
      <Grid gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          {!onChange && (
            <span className="uk-margin-small-right">
              <Icon name="bolt" />
            </span>
          )}
          Mes atouts
        </h3>
        {onChange && (
          <ButtonIcon
            name="pencil"
            onClick={() => {
              openModal(
                <ModalEdit
                  title="Édition - Mes atouts (6 maximum)"
                  formSchema={formEditSkills}
                  defaultValues={list.reduce((acc, { name }, i) => {
                    acc[`skill${i + 1}`] = name;
                    return acc;
                  }, {})}
                  onSubmit={async (fields, closeModal) => {
                    closeModal();
                    const fieldsTransform = {
                      skills: Object.values(fields)
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
          <li>Aucun atout renseigné</li>
        )}
      </ul>
    </div>
  );
};
SkillsCard.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ),
  onChange: PropTypes.func,
};

SkillsCard.defaultProps = {
  list: [],
  onChange: null,
};
