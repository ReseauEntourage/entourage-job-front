import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const StyledProfileContactInfos = styled.div`
  display: flex;
  flex-direction: row;
  background: ${COLORS.hoverBlue};
  padding: 7px 10px;
  border-radius: 10px;
  gap: 80px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column;
    gap: 20px;
  }
`;
