import PropTypes from 'prop-types';
import React from 'react';
import schemaTestimonial from 'src/components/forms/schema/formEditTestimonial.json';
import { openModal } from 'src/components/modals/Modal';
import { ModalConfirm } from 'src/components/modals/Modal/ModalGeneric/ModalConfirm';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Grid, ButtonIcon, Icon } from 'src/components/utils';
import { formatParagraph, sortByName } from 'src/utils';

export const CVEditReviews = ({ reviews, onChange }) => {
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
                  formSchema={schemaTestimonial}
                  onSubmit={async (fields, closeModal) => {
                    closeModal();
                    await onChange({
                      reviews: [...reviews, fields],
                    });
                  }}
                />
              );
            }}
            name="plus"
          />
        )}
      </Grid>
      <ul className="uk-list uk-list-divider">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review, i) => {
            return (
              <li id={i} key={i} className="">
                <Grid
                  eachWidths={['auto', 'expand']}
                  className="uk-padding-small uk-padding-remove-horizontal"
                >
                  <Icon name="quote-right" />
                  <>
                    <p className="uk-text-small uk-margin-small">
                      {formatParagraph(review.text)}
                    </p>
                    <p className="uk-text-bold uk-margin-small uk-margin-remove-bottom">
                      {review.name}
                    </p>
                    <p className="uk-margin-remove">{review.status}</p>
                  </>
                  <span className="uk-text-muted uk-margin-small">
                    <div className="uk-flex uk-flex-column">
                      <ButtonIcon
                        name="pencil"
                        onClick={() => {
                          openModal(
                            <ModalEdit
                              title="Édition - Ils me recommandent"
                              formSchema={schemaTestimonial}
                              defaultValues={{ ...review }}
                              onSubmit={async (fields, closeModal) => {
                                closeModal();
                                sortedReviews[i] = fields;
                                await onChange({ reviews: sortedReviews });
                              }}
                            />
                          );
                        }}
                      />
                      <ButtonIcon
                        name="trash"
                        onClick={() => {
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
                    </div>
                  </span>
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
CVEditReviews.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ),
  onChange: PropTypes.func,
};
CVEditReviews.defaultProps = {
  reviews: [],
  onChange: null,
};
