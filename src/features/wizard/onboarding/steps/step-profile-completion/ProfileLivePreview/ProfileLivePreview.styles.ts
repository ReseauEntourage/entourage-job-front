import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
`;

export const StyledIdentityBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 13px;
`;

export const StyledImgProfileAndName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const StyledBlocks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 16px;
`;

export const StyledBlock = styled.div`
  padding: 12px 16px;
  border: 1px solid ${COLORS.gray};
  border-radius: 8px;
  background: ${COLORS.white};
`;

export const StyledBlockTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 6px;
`;

export const StyledPillsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const StyledExperienceItem = styled.div`
  font-size: 13px;
  color: #333;
  padding: 2px 0;
`;
