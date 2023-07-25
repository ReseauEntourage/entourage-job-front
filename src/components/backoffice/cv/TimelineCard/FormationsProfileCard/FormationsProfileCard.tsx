import React from 'react';

import schemaformEditFormation from 'src/components/forms/schema/formEditFormation.json';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { sortByOrder } from 'src/utils';

import { TimelineCard } from '../TimelineCard';



export const FormationsProfileCard = ({ formations, onChange }) => {
  
  console.log(formations);
  const sortedFormations = sortByOrder(formations);

  return (
    <TimelineCard 
      experiences={sortedFormations}
      onChange={onChange}
      title={<>Mes <span className="uk-text-primary">formations</span></>}
      onAdd={() => {
        openModal(
          <ModalEdit
            title="Ajout -Mes formations"
            formSchema={schemaformEditFormation}
            onSubmit={async (fields, closeModal) => {
              closeModal();
              await onChange({
                formations: [
                  ...sortedFormations,
                  {
                    ...fields,
                    order:
                      formations.reduce((acc, val) => {
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
        title: "Édition - Mes formations",
        formSchema: schemaformEditFormation
      }}
    />
  );
};

// FormationProfileCard.propTypes = {
//   experiences: PropTypes.arrayOf(
//     PropTypes.shape({
//       description: PropTypes.string,
//     })
//   ),
//   onChange: PropTypes.func,
// };

// FormationProfileCard.defaultProps = {
//   experiences: [],
//   onChange: null,
// };
