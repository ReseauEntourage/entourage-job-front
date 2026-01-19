import { useMemo } from 'react';
import { Color } from '@/src/constants/styles';
import { LucidIcon } from '../../Icons';
import { RoundBadge, RoundBadgeProps } from '../RoundBadge/RoundBadge';

export type NumberCheckableBadgeProps = Exclude<RoundBadgeProps, 'children'> & {
  number: number;
};

export const NumberCheckableBadge = ({
  number,
  active = false,
  borderColor,
  checked = false,
  size = 50,
}: {
  number: number;
  active?: boolean;
  borderColor?: Color;
  checked?: boolean;
  size?: number;
}) => {
  const textColor = useMemo(() => {
    if (checked) {
      return 'white';
    }
    return active ? 'black' : 'darkGray';
  }, [active, checked]);

  return (
    <RoundBadge
      active={active}
      borderColor={borderColor}
      size={size}
      bgColor={checked ? borderColor : 'white'}
    >
      {checked ? (
        <LucidIcon stroke="bold" name="Check" color={textColor} />
      ) : (
        number
      )}
    </RoundBadge>
  );
};
