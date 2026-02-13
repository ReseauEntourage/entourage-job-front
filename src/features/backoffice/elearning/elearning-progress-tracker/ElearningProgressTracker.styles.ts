import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

const CARD_PROGRESS_EXCEEDING_Y = 20;
const CARD_PADDING = 20;

export const StyledElearningProgressTracker = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: ${CARD_PADDING}px 0px;
  margin-bottom: 25px;
`;

export const StyledElearningProgressTrackerContent = styled.div`
  display: flex;
  gap: 24px;
  padding: 20px;
  justify-content: space-between;
  align-items: stretch;
`;

export const StyledElearningProgressBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  background-color: ${COLORS.lightGray};
  border-radius: 20px;
  margin: -${CARD_PADDING + CARD_PROGRESS_EXCEEDING_Y}px 0px;
  border: 2px solid ${COLORS.gray};
  padding: 20px;
`;
