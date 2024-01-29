import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledCardListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledCardList = styled.ul`
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  padding: 0;
`;

export const StyledCardListNoResult = styled.div`
  flex: 1;
  font-size: 14px;
  font-style: italic;
  color: ${COLORS.darkGray};
`;

export const StyledCardListSpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;
