import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledFileInfosContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const StyledDeleteIconContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  border: ${COLORS.primaryBlue} 1px solid;
  transition: 0.3s ease-in-out;
  cursor: pointer;
  :hover {
    background-color: ${COLORS.lightGray};
  }
`;

export const StyledFilename = styled.div`
  text-decoration: underline;
  cursor: pointer;
`;
