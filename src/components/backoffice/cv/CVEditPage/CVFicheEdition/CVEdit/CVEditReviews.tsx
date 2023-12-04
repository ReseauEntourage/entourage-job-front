import React from 'react';
import PlusIcon from 'assets/icons/plus.svg';
import QuoteLeftIcon from 'assets/icons/quote-left.svg';
import QuoteRightIcon from 'assets/icons/quote-right.svg';
import { EditItemsButtons } from 'src/components/backoffice/cv/CVEditPage/CVFicheEdition/EditItemsButtons';
import { formEditTestimonial } from 'src/components/forms/schemas/formEditTestimonial';
import { openModal } from 'src/components/modals/Modal';
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Grid, ButtonIcon } from 'src/components/utils';
import { formatParagraph, sortByName } from 'src/utils';

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
    <div className="uk-card uk-card-default uk-card-body">
      <Grid gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          Ils me <span className="uk-text-primary">recommandent</span>
        </h3>
        {sortedReviews.length < MAX_REVIEWS && (
          <ButtonIcon
            onClick={() => {
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
            }}
            icon={<PlusIcon />}
          />
        )}
      </Grid>
      <ul className="uk-list uk-list-divider">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review, i) => {
            return (
              <li id={i.toString()} key={i} className="">
                <Grid
                  gap="small"
                  eachWidths={['auto', 'expand']}
                  className="uk-padding-small uk-padding-remove-horizontal"
                >
                  <QuoteLeftIcon width={15} height={15} />
                  <>
                    <p className="uk-text-small uk-margin-small">
                      {formatParagraph(review.text)}
                    </p>
                    <p className="uk-text-bold uk-margin-small uk-margin-remove-bottom">
                      {review.name}
                    </p>
                    <p className="uk-margin-remove">{review.status}</p>
                  </>
                  <div className="uk-flex uk-flex-column uk-flex-right uk-height-1-1">
                    <QuoteRightIcon width={15} height={15} />
                  </div>
                  <EditItemsButtons
                    onEditClick={() => {
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
                    onDeleteClick={() => {
                      openModal(
                        <ModalConfirm
                          text="Êtes-vous sûr(e) de vouloir supprimer cette recommandation ?"
                          buttonText="Supprimer"
                          onConfirm={() => {
                            sortedReviews.splice(i, 1);
                            onChange({ reviews: sortedReviews });
                          }}
                        />
                      );
                    }}
                  />
                </Grid>
              </li>
            );
          })
        ) : (
          <li className="uk-text-italic">
            Aucune recommandation n&apos;a encore été ajoutée
          </li>
        )}
      </ul>
    </div>
  );
};
