import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledProfileSubHeader = styled.div`
  display: flex;
  gap: 30px;
  justify-content: space-between;
`;

export const StyledAccordionHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledAccordionHeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background-color: ${COLORS.extraDarkBlue};
  margin-right: 15px;
`;

export const StyledAccordionHeaderTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledButtonGenerateCVContainer = styled.div`
  display: flex;
  flex: 1;
  background-color: red;
  align-items: stretch;
`;

export const StyledPhotosAndIntroductionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const StyledPhotoRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 16px;
  flex-wrap: wrap;
`;

export const StyledPhotoInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledPhotoPreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
