import React, { useMemo } from 'react';
import { Text } from '@/src/components/ui/Text/Text';
import { Color } from '@/src/constants/styles';
import { StyledRoundBadge } from './RoundBadge.styles';

export interface RoundBadgeProps {
  size?: number;
  active?: boolean;
  borderColor?: Color;
  children?: React.ReactNode;
  textColor?: Color;
  bgColor?: Color;
  borderSize?: number;
}

export const RoundBadge = ({
  size = 50,
  active,
  borderColor = 'darkBlue',
  children,
  textColor,
  bgColor = borderColor,
  borderSize = 3,
}: RoundBadgeProps) => {
  const computedTextColor = useMemo(() => {
    if (textColor) {
      return textColor;
    }
    return active ? 'black' : 'darkGray';
  }, [active, textColor]);

  return (
    <StyledRoundBadge
      active={active}
      borderColor={borderColor}
      bgColor={bgColor}
      size={size}
      textColor={computedTextColor}
      borderSize={borderSize}
    >
      <Text
        weight={active ? 'semibold' : 'normal'}
        size={20}
        color={computedTextColor}
      >
        {children}
      </Text>
    </StyledRoundBadge>
  );
};
