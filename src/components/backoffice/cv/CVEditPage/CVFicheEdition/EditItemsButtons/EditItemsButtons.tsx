import React from 'react';
import { ButtonIcon } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { StyledEditItemsButtons } from './EditItemsButtons.styles';

interface EditItemsButtonsProps {
  onEditClick: () => void;
  onDeleteClick: () => void;
}
export function EditItemsButtons({
  onEditClick,
  onDeleteClick,
}: EditItemsButtonsProps) {
  return (
    <StyledEditItemsButtons>
      <ButtonIcon icon={<LucidIcon name="Pencil" />} onClick={onEditClick} />
      <ButtonIcon icon={<LucidIcon name="Trash" />} onClick={onDeleteClick} />
    </StyledEditItemsButtons>
  );
}
