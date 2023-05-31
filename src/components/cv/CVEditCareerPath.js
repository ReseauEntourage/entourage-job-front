import React from 'react';
import PropTypes from 'prop-types';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import schemaCareerPath from 'src/components/forms/schema/formEditCareerPath';
import { ButtonIcon, Grid } from 'src/components/utils';
import { openModal } from 'src/components/modals/Modal';
import { AMBITIONS_PREFIXES, BUSINESS_LINES } from 'src/constants/index.ts';
import { findConstantFromValue, sortByOrder } from 'src/utils';
import { CVCareerPathSentence } from 'src/components/cv/CVCareerPathSentence';

export const CVEditCareerPath = ({ ambitions, businessLines, onChange }) => {
  const sortedAmbitions =
    ambitions && ambitions.length > 0 ? sortByOrder(ambitions) : null;

  const sortedBusinessLines =
    businessLines && businessLines.length > 0
      ? sortByOrder(businessLines)
      : null;

  const defaultValues = {
    ...sortedAmbitions?.reduce((acc, curr) => {
      return {
        ...acc,
        [`ambition${curr.order}`]: curr.name,
      };
    }, {}),
    ...sortedBusinessLines?.reduce((acc, curr) => {
      return {
        ...acc,
        [`businessLine${curr.order}`]: findConstantFromValue(
          curr.name,
          BUSINESS_LINES
        ),
      };
    }, {}),
  };

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
                  description="J'aimerais travailler dans ..."
                  formSchema={schemaCareerPath}
                  defaultValues={defaultValues}
                  onSubmit={async (
                    { ambition0, businessLine0, ambition1, businessLine1 },
                    closeModal
                  ) => {
                    closeModal();
                    let newAmbitions = [];
                    if (ambition0) {
                      newAmbitions = [
                        ...newAmbitions,
                        {
                          prefix: AMBITIONS_PREFIXES[1].label,
                          name: ambition0,
                          order: 0,
                        },
                      ];
                    }
                    if (ambition1) {
                      newAmbitions = [
                        ...newAmbitions,

                        {
                          prefix: AMBITIONS_PREFIXES[1].label,
                          name: ambition1,
                          order: 1,
                        },
                      ];
                    }
                    const newBusinessLines = [
                      { name: businessLine0, order: 0 },
                    ];

                    await onChange({
                      businessLines: businessLine1
                        ? [
                            ...newBusinessLines,
                            {
                              name: businessLine1,
                              order: 1,
                            },
                          ]
                        : newBusinessLines,
                      ambitions: newAmbitions,
                    });
                  }}
                />
              );
            }}
          />
        )}
      </Grid>
      {!sortedAmbitions && !sortedBusinessLines ? (
        <p className="uk-text-italic">
          Aucun projet professionnel n&apos;a pas encore été créé.
        </p>
      ) : (
        <p>
          <CVCareerPathSentence
            ambitions={ambitions}
            businessLines={businessLines}
          />
        </p>
      )}
    </div>
  );
};

CVEditCareerPath.propTypes = {
  ambitions: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        order: PropTypes.number.isRequired,
        prefix: PropTypes.oneOf(
          AMBITIONS_PREFIXES.map(({ value }) => {
            return value;
          })
        ),
      })
    ),
    PropTypes.string,
  ]).isRequired,
  businessLines: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        order: PropTypes.number.isRequired,
      })
    ),
    PropTypes.string,
  ]).isRequired,
  onChange: PropTypes.func,
};
CVEditCareerPath.defaultProps = {
  onChange: null,
};
