import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

const StyledReviewContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5%;
`;

const StyledReviewCard = styled.div`
  padding: 35px;
  width: 30%;
  box-sizing: border-box;
  /* background-color: #fef8f5; */
  background-color: ${COLORS.hoverBlue};
  border-radius: 60px;
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  font-size: 14px;
  line-height: 27px;
  gap: 20px;
  margin: 20px 0;
  &.mobile {
    width: 100%;
    font-size: 14px;
    gap: 10px;
  }
`;

const StyledReviewCardAuthor = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  line-height: 21px;
  color: ${COLORS.mediumGray};
  margin-top: 40px;
  img {
    border-radius: 50%;
  }
  .legend {
    margin-left: 10px;
  }
  &.mobile {
    font-size: 12px;
  }
`;

export { StyledReviewCard, StyledReviewContainer, StyledReviewCardAuthor };
