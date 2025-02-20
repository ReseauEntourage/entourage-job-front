import React from 'react';
import { Img, Section } from 'src/components/utils';
import { H3 } from 'src/components/utils/Headings';
import { Text } from 'src/components/utils/Text';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledReviewCard,
  StyledReviewContainer,
  StyledReviewCardAuthor,
} from './Reviews.styles';

interface ReviewsProps {
  reviews: {
    author: string;
    authorStatus?: string;
    company?: string;
    industry?: string;
    companyInfo?: string;
    review: React.ReactNode;
    image?: string;
  }[];
  title: string;
}

export const Reviews = ({ reviews, title }: ReviewsProps) => {
  const isDesktop = useIsDesktop();
  return (
    <Section id="reviews" style="default">
      <H3 title={title} center />
      <br />
      <StyledReviewContainer data-uk-scrollspy="cls:uk-animation-slide-bottom-small; target: .review-card; delay: 200">
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
              <StyledReviewCard
                className={`${isDesktop ? '' : 'mobile'} review-card`}
                key={index}
              >
                <Text size="large">{review}</Text>
                <StyledReviewCardAuthor className={isDesktop ? '' : 'mobile'}>
                  {image && (
                    <Img
                      src={image}
                      alt={`Témoignage de ${author}`}
                      width={45}
                      height={45}
                    />
                  )}
                  <div className="legend">
                    {author}
                    {authorStatus && <span>, {authorStatus}</span>}
                    {company && <span>, {company}</span>}
                    {industry && <span>, {industry}</span>}
                    {companyInfo && <span>, {companyInfo}</span>}
                  </div>
                </StyledReviewCardAuthor>
              </StyledReviewCard>
            );
          }
        )}
      </StyledReviewContainer>
    </Section>
  );
};
