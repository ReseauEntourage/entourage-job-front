import React from 'react';
import PencilIcon from 'assets/icons/pencil.svg';
import TrashIcon from 'assets/icons/trash.svg';
import { ButtonIcon } from 'src/components/utils';
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
      <ButtonIcon icon={<PencilIcon />} onClick={onEditClick} />
      <ButtonIcon icon={<TrashIcon />} onClick={onDeleteClick} />
    </StyledEditItemsButtons>
  );
}
