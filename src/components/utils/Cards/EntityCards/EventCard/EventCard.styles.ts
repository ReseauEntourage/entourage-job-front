import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledEventCardPictureContainer = styled.div`
  position: relative;
`;

export const StyledEventCardPicture = styled.div`
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  position: relative;
  height: 175px;
`;

export const StyledEventCardParticipation = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: ${COLORS.primaryBlue};
  padding: 4px 8px;
  border-radius: 20px;
`;

export const StyledEventCardContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 14px 20px;
  gap: 10px;
  flex: 1;
`;

export const StyledEventInfoElementContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
`;

export const StyledEventInfoElement = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const StyledSeparator = styled.hr`
  width: 100%;
  margin: 5px 0;
`;
