import styled, { css } from 'styled-components';
import { COLORS } from 'src/constants/styles';
import { BadgeVariant } from './Badge.types';

const badgeVariantStyles: Record<BadgeVariant, ReturnType<typeof css>> = {
  [BadgeVariant.Primary]: css`
    background-color: ${COLORS.primaryBlue};
    color: ${COLORS.white};
  `,
  [BadgeVariant.HoverBlue]: css`
    background-color: ${COLORS.hoverBlue};
    color: ${COLORS.darkBlue};
  `,
  [BadgeVariant.ExtraLightTeal]: css`
    background-color: ${COLORS.extraLightTeal};
    color: ${COLORS.teal};
  `,
  [BadgeVariant.ExtraLightPurple]: css`
    background-color: ${COLORS.extraLightPurple};
    color: ${COLORS.purple};
  `,
  [BadgeVariant.ExtraLightGreen]: css`
    background-color: ${COLORS.extraLightGreen};
    color: ${COLORS.mediumGreen};
  `,
  [BadgeVariant.ExtraLightAmber]: css`
    background-color: ${COLORS.extraLightAmber};
    color: ${COLORS.amber};
  `,
};

export const StyledBadge = styled.div<{
  variant: BadgeVariant;
  $borderRadius?: 'small' | 'medium' | 'large';
}>`
  padding: 6px 12px;
  border-radius: ${({ $borderRadius }) => {
    switch ($borderRadius) {
      case 'small':
        return '6px';
      case 'medium':
        return '8px';
      case 'large':
        return '16px';
      default:
        return '6px';
    }
  }};
  ${({ variant }) => badgeVariantStyles[variant]}
`;
