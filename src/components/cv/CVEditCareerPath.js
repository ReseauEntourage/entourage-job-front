import React from 'react';
import PropTypes from 'prop-types';
import ModalEdit from 'src/components/modals/ModalEdit';
import schemaCareerPath from 'src/components/forms/schema/formEditCareerPath';
import ButtonIcon from 'src/components/utils/ButtonIcon';
import { Grid } from 'src/components/utils';
import { openModal } from 'src/components/modals/Modal';
import { AMBITIONS_PREFIXES } from 'src/constants';
import { getAmbitionsLinkingSentence, sortByOrder } from 'src/utils';

const CVEditCareerPath = ({ ambitions, onChange }) => {
  const sortedAmbitions =
    ambitions && ambitions.length > 0 ? sortByOrder(ambitions) : null;

  const defaultValues = sortedAmbitions?.reduce((acc, curr, index) => {
    return {
      ...acc,
      [`careerPath${index}`]: curr.name,
      [`prefix${index}`]: curr.prefix,
    };
  }, {});

  return (
    <div className="uk-card uk-card-default uk-card-body">
      <Grid gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          Mon <span className="uk-text-primary">projet professionnel</span>
        </h3>
        {onChange && (
          <ButtonIcon
            name="pencil"
            onClick={() => {
              openModal(
                <ModalEdit
                  title="Édition - Projet professionnel"
                  description="J'aimerais travailler ..."
                  formSchema={schemaCareerPath}
                  defaultValues={defaultValues}
                  onSubmit={(
                    { prefix0, careerPath0, /* prefix1, */ careerPath1 },
                    closeModal
                  ) => {
                    closeModal();
                    const newAmbitions = [
                      { prefix: prefix0, name: careerPath0, order: 0 },
                    ];

                    onChange({
                      ambitions: careerPath1
                        ? [
                            ...newAmbitions,
                            {
                              prefix:
                                /* prefix1 */ prefix0 ||
                                AMBITIONS_PREFIXES[0].label,
                              name: careerPath1,
                              order: 1,
                            },
                          ]
                        : newAmbitions,
                    });
                  }}
                />
              );
            }}
          />
        )}
      </Grid>
      {!sortedAmbitions ? (
        <p className="uk-text-italic">
          Aucun projet professionnel n&apos;a pas encore été créé.
        </p>
      ) : (
        <p>
          J&apos;aimerais travailler {sortedAmbitions[0].prefix}{' '}
          <span className="uk-text-primary">{sortedAmbitions[0].name}</span>
          {sortedAmbitions && sortedAmbitions.length > 1 && (
            <>
              {getAmbitionsLinkingSentence(sortedAmbitions)}
              <span className="uk-text-primary">{sortedAmbitions[1].name}</span>
            </>
          )}
        </p>
      )}
    </div>
  );
};

CVEditCareerPath.propTypes = {
  ambitions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
      prefix: PropTypes.oneOf(
        AMBITIONS_PREFIXES.map(({ value }) => {
          return value;
        })
      ),
    })
  ).isRequired,
  onChange: PropTypes.func,
};
CVEditCareerPath.defaultProps = {
  onChange: null,
};
export default CVEditCareerPath;
