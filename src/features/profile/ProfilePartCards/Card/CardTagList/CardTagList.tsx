import React from 'react';
import { Tag } from '@/src/components/ui';
import { StyledTagList } from './CardTagList.styles';

export type TagItem = {
  id?: string;
  name: string;
};

export interface CardTagListProps {
  items?: TagItem[];
  isEditable?: boolean;
  removeCallback?: (idx: number) => void;
}

export const CardTagList = ({
  items = [],
  isEditable = false,
  removeCallback,
}: CardTagListProps) => {
  return (
    <StyledTagList>
      {items.map((item, idx) => (
        <Tag
          content={item.name}
          key={idx}
          removeCallback={
            isEditable && removeCallback
              ? () => {
                  removeCallback(idx);
                }
              : undefined
          }
        />
      ))}
    </StyledTagList>
  );
};
