import arrayMove from 'array-move';
import PropTypes from 'prop-types';
import React from 'react';

import schemaformEditExperience from 'src/components/forms/schema/formEditExperience.json';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { sortByOrder } from 'src/utils';

import { TimelineCard } from '../TimelineCard';



export const ExperiencesProfileCard = ({ experiences, onChange }) => {
  
  const sortedExperiences = sortByOrder(experiences);


  return (
    <TimelineCard 
      experiences={sortedExperiences}
      onChange={onChange}
      title={<>Mes <span className="uk-text-primary">expériences</span> et{' '}<span className="uk-text-primary">compétences</span></>}
      onAdd={() => {
        openModal(
          <ModalEdit
            title="Ajout -Mes expériences et compétences"
            formSchema={schemaformEditExperience}
            onSubmit={async (fields, closeModal) => {
              closeModal();
              await onChange({
                experiences: [
                  ...sortedExperiences,
                  {
                    ...fields,
                    order:
                      experiences.reduce((acc, val) => {
                        return acc === undefined || val.order > acc
                          ? val.order
                          : acc;
                      }, []) + 1,
                    skills: fields.skills?.map((skill) => {
                      return {
                        name: skill,
                      };
                    }),
                  },
                ],
              });
            }}
          />
        );
      }}
      editProps={{
        title: "Édition - Mes expériences et compétences",
        formSchema: schemaformEditExperience
      }}
    />
  );
};

// ExperiencesProfileCard.propTypes = {
//   experiences: PropTypes.arrayOf(
//     PropTypes.shape({
//       description: PropTypes.string,
//     })
//   ),
//   onChange: PropTypes.func,
// };

// ExperiencesProfileCard.defaultProps = {
//   experiences: [],
//   onChange: null,
// };
