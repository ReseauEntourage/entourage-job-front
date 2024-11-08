import React from 'react';
import { ReviewItem } from '../ReviewItem/ReviewItem';
import { formEditTestimonial } from 'src/components/forms/schemas/formEditTestimonial';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Card, Typography } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { sortByName } from 'src/utils';
import { ReviewItemList } from './CVEditReviews.styles';

interface Review {
  name: string;
  text: string;
  status: string;
}

interface CVEditReviewsProps {
  reviews: Review[];
  onChange: (updatedCV: { reviews: Review[] }) => void;
}

export const CVEditReviews = ({ reviews, onChange }: CVEditReviewsProps) => {
  const MAX_REVIEWS = 3;

  const sortedReviews = sortByName(reviews);

  return (
    <Card
      title="Ils me recommandent"
      editCallback={
        sortedReviews.length < MAX_REVIEWS
          ? () => {
              openModal(
                <ModalEdit
                  title="Ajout - Ils me recommandent"
                  formSchema={formEditTestimonial}
                  onSubmit={(fields, closeModal) => {
                    closeModal();
                    onChange({
                      reviews: [...reviews, fields],
                    });
                  }}
                />
              );
            }
          : undefined
      }
      editButtonText="Ajouter"
      editIcon={<LucidIcon name="Plus" />}
    >
      <ReviewItemList>
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review, i) => {
            return (
              <ReviewItem
                review={review}
                key={i}
                onEditCallback={() => {
                  openModal(
                    <ModalEdit
                      title="Édition - Ils me recommandent"
                      formSchema={formEditTestimonial}
                      defaultValues={{ ...review }}
                      onSubmit={(fields, closeModal) => {
                        closeModal();
                        sortedReviews[i] = fields;
                        onChange({ reviews: sortedReviews });
                      }}
                    />
                  );
                }}
                onDeleteCallback={() => {
                  sortedReviews.splice(i, 1);
                  onChange({ reviews: sortedReviews });
                }}
              />
            );
          })
        ) : (
          <Typography variant="italic">
            Aucune recommandation n&apos;a encore été ajoutée
          </Typography>
        )}
      </ReviewItemList>
    </Card>
  );
};
