import React from 'react';
import { CVExperience, CVFormation } from 'src/api/types';
import { formEditExperience } from 'src/components/forms/schemas/formEditExperience';
import { formEditFormation } from 'src/components/forms/schemas/formEditFormation';
import { TimeLineItem } from './TimeLineItem';

type CVData = {
  formations: CVFormation[];
  experiences: CVExperience[];
};

type CVDataUpdate = {
  [type in 'formations' | 'experiences']: CVData[type];
};

interface TimeLineListProps {
  items: CVExperience[] | CVFormation[];
  onChange: (updatedCV: CVDataUpdate) => void;
  editProps: {
    title: string;
    formSchema: typeof formEditExperience | typeof formEditFormation;
  };
  type: keyof CVData;
}

export const TimeLineList = ({
  items,
  onChange,
  editProps,
  type,
}: TimeLineListProps) => {
  return (
    <ul
      id="experiences"
      className={`uk-list${items.length > 0 ? ' ent-list' : ''}`}
    >
      {items.length <= 0 ? (
        <li className="uk-text-italic">
          Aucune expérience n&apos;a encore été ajoutée
        </li>
      ) : (
        items.map((value, index) => {
          return (
            <TimeLineItem
              key={`item-${index}`}
              sortIndex={index}
              value={value}
              onChange={onChange}
              items={items}
              editProps={editProps}
              type={type}
            />
          );
        })
      )}
    </ul>
  );
};
