import { styled } from 'styled-components';
import { BREAKPOINTS } from '@/src/constants/styles';

export const StyledHelpGroupList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const StyledHelpGroupsHeader = styled.div`
  margin-bottom: 24px;
`;
