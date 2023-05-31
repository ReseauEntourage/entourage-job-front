import React from 'react';
import { Img, Section, Grid } from 'src/components/utils';

interface ReviewsType {
  reviews: {
    author: string;
    authorStatus: string;
    company: string;
    industry: string;
    companyInfo: string;
    review: string;
    image: string;
  }[];
  title: string | JSX.Element | JSX.Element[];
}

export const Reviews = ({ reviews, title }: ReviewsType) => {
  return (
    <Section id="reviews" style="default" container="small">
      <h2 className="uk-text-bold uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
        {title}
      </h2>
      <div
        className="uk-flex uk-flex-center"
        data-uk-height-match=".ent-review-card"
      >
        <Grid center middle match gap="medium" childWidths={['1-2@m']}>
          {reviews.map(
            (
              {
                author,
                authorStatus,
                company,
                industry,
                companyInfo,
                review,
                image,
              },
              index
            ) => {
              return (
                <div
                  key={index}
                  data-uk-scrollspy={`cls:uk-animation-slide-bottom-small; delay: ${
                    200 + index * 200
                  };`}
                  className="ent-review-card uk-flex uk-flex-row uk-card uk-card-medium uk-card-default uk-card-body uk-box-shadow-medium uk-border-rounded"
                >
                  <div className="uk-flex uk-flex-column">
                    <div className="uk-flex uk-flex-middle uk-margin-small-bottom">
                      <div
                        className="uk-cover-container uk-margin-small-right uk-border-rounded"
                        style={{ width: 75, height: 75 }}
                      >
                        <Img src={image} alt={author} cover />
                      </div>
                      <div className="uk-flex-1 uk-margin-small-left uk-text-small">
                        <p className="uk-text-bold uk-margin-small uk-margin-remove-bottom">
                          {author}
                        </p>
                        {authorStatus && (
                          <p className="uk-margin-remove uk-text-italic">
                            {authorStatus}
                          </p>
                        )}
                        <p className="uk-text-meta uk-margin-remove uk-text-italic">
                          <span className="uk-text-bold">{company}</span>
                          {industry && <span>,&nbsp;{industry}</span>}
                          {companyInfo && (
                            <>
                              <br />
                              <span className="uk-text-lighter">
                                {companyInfo}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="uk-flex uk-flex-column uk-flex-center uk-margin-small-top">
                      <p className="uk-margin-remove uk-text-bold">
                        &laquo;&nbsp;{review}&nbsp;&raquo;
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </Grid>
      </div>
    </Section>
  );
};
