import { styled } from 'styled-components';
import { marginLargeTop } from '@/src/styles/margins';

/** Carousel centered under the title. */
export const StyledTestimoniesCarousel = styled.div`
  display: flex;
  justify-content: center;
  ${marginLargeTop}
`;

/** Quote, set in small italics under the opening quotation mark. */
export const StyledTestimonyQuote = styled.p`
  font-size: 0.875rem;
  line-height: 1.5;
  font-style: italic;
  margin-top: 10px !important;
  margin-bottom: 10px;
`;

export const StyledTestimonyClosingQuote = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const StyledTestimonyAuthor = styled.p`
  font-weight: 700;
  margin-top: 10px !important;
  margin-bottom: 0 !important;
`;

export const StyledTestimoniesVideo = styled.div`
  margin-top: 40px !important;
`;
