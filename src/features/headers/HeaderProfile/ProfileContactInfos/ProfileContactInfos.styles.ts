import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const StyledProfileContactInfos = styled.div`
  display: flex;
  flex-direction: column;
  background: ${COLORS.hoverBlue};
  padding: 7px 10px;
  border-radius: 10px;
  gap: 12px;
`;

export const StyledInfosContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 80px;
  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column;
    gap: 20px;
  }
`;

export const StyledPrivacyContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  color: ${COLORS.darkGray};
`;
