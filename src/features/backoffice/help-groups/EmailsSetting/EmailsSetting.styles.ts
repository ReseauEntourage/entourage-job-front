import { css, styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledEmailsSetting = styled.div<{ $isHighlighted: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 16px;
  border: 1px solid ${COLORS.gray};
  border-radius: 16px;
  background-color: ${COLORS.white};
  transition: background-color 0.4s;

  ${({ $isHighlighted }) =>
    $isHighlighted &&
    css`
      border-color: ${COLORS.primaryBlue};
      background-color: ${COLORS.hoverBlue};
    `}
`;

export const StyledEmailsSettingText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
