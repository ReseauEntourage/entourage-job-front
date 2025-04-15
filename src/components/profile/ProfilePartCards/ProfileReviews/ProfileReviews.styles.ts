import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledProfileReviewsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

export const StyledReviewItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: ${COLORS.hoverBlue};
  padding: 30px;
  border-radius: 30px;
  justify-content: space-between;
`;

export const StyledReviewAuthorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
