import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledCvUploadInfos = styled.div`
  display: flex;
  flex: 1;
  gap: 10px;
  align-items: center;
`;

export const StyledCvCardContentContainer = styled.div`
  display: flex;
  justify-items: center;
  flex-direction: column;
  gap: 20px;
`;

export const StyledFilename = styled.div`
  text-decoration: underline;
  cursor: pointer;
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
    background-color: ${COLORS.lightgray};
  }
`;

export const StyledCvUploadInfosText = styled.p`
  margin: 0;
`;
