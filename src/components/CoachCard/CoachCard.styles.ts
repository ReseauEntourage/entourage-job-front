import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledCoachCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid ${COLORS.gray};
  border-radius: 8px;
  background: ${COLORS.white};
`;

export const StyledAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: ${COLORS.primaryBlue};
  color: ${COLORS.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
`;

export const StyledInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

export const StyledName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${COLORS.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledMeta = styled.span`
  font-size: 12px;
  color: ${COLORS.darkGray};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
