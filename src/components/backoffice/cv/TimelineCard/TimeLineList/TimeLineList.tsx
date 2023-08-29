import React from 'react';
import { CVExperience, CVFormation } from 'src/api/types';
import { AnyCantFix } from 'src/utils/Types';
import { TimeLineItem } from './TimeLineItem';

interface TimeLineListProps {
  items: CVExperience[] | CVFormation[];
  onChange: (arg1: any) => void;
  editProps: {
    title: string;
    formSchema: AnyCantFix;
  };
  type: string;
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
