import React from 'react'
import { SortableContainer } from 'react-sortable-hoc';
import { TimeLineItem } from './TimeLineItem';

export const TimeLineList = SortableContainer(({ items, onChange, editProps, updateOrder }) => {
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
                index={index}
                sortIndex={index}
                value={value}
                onChange={onChange}
                updateOrder={updateOrder}
                items={items}
                editProps={editProps}
              />
            );
          })
        )}
      </ul>
    );
  });