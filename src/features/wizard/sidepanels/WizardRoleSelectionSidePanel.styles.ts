import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 32px;
`;

export const StyledTopSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: auto;
  gap: 16px;
`;

export const StyledVerbatimCard = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 20px;
  gap: 16px;
  margin: 24px 0;
`;

export const StyledPersonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StyledPersonAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

export const StyledPersonName = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${COLORS.white};
  margin: 0;
`;

export const StyledPersonDescription = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
`;

export const StyledBottomSection = styled.div`
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

export const StyledStackAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${COLORS.extraDarkBlue};
  object-fit: cover;
`;
