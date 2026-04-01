import styled from 'styled-components';
import { BREAKPOINTS } from '@/src/constants/styles';

export const StyledStatList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
  flex-wrap: wrap;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column;
  }
`;

export const StyledStatItem = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

export const StyledIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
`;

export const StyledStatTitleValue = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  flex-wrap: nowrap;
`;
