import React from 'react';
import { EditItemsButtons } from '../../EditItemsButtons';
import { openModal } from 'src/components/modals/Modal';
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import { Text } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { COLORS } from 'src/constants/styles';
import { formatParagraph } from 'src/utils';
import {
  StyledReviewContent,
  StyledReviewItemContainer,
} from './ReviewItem.styles';

export interface ReviewItemProps {
  review: {
    name: string;
    text: string;
    status: string;
  };
  onEditCallback: () => void;
  onDeleteCallback: () => void;
}
export const ReviewItem = ({
  review,
  onEditCallback,
  onDeleteCallback,
}: ReviewItemProps) => {
  return (
    <StyledReviewItemContainer>
      <StyledReviewContent>
        <div>
          <LucidIcon name="Quote" style="solid" color={COLORS.primaryBlue} />
          <Text>{formatParagraph(review.text)}</Text>
        </div>
        <div>
          <Text weight="bold">{review.name}</Text>
          <Text variant="italic">{review.status}</Text>
        </div>
      </StyledReviewContent>
      <div className="edit-buttons">
        <EditItemsButtons
          onEditClick={onEditCallback}
          onDeleteClick={() => {
            openModal(
              <ModalConfirm
                text="Êtes-vous sûr(e) de vouloir supprimer cette recommandation ?"
                buttonText="Supprimer"
                onConfirm={onDeleteCallback}
              />
            );
          }}
        />
      </div>
    </StyledReviewItemContainer>
  );
};
