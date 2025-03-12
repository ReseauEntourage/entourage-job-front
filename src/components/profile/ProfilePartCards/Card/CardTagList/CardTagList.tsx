import React from 'react';
import { ProfilePartCard } from '../Card/Card';
import { Tag } from 'src/components/utils';
import { StyledTagList } from './CardTagList.styles';

export type TagItem = {
  id?: string;
  name: string;
};

export interface CardTagListProps {
  title: string;
  items?: TagItem[];
  isEditable?: boolean;
  editCallback?: () => void;
  isCompleted?: boolean;
  removeCallback?: (idx: number) => void;
  iaGenerated?: boolean;
}

export const CardTagList = ({
  title,
  items = [],
  isEditable = false,
  isCompleted,
  editCallback,
  removeCallback,
  iaGenerated,
}: CardTagListProps) => {
  return (
    <ProfilePartCard
      title={title}
      isCompleted={isCompleted}
      isEditable={isEditable}
      editCallback={editCallback}
      iaGenerated={iaGenerated}
    >
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
    </ProfilePartCard>
  );
};
