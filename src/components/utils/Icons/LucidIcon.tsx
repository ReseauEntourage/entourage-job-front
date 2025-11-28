import { icons } from 'lucide-react';

import React, { useMemo } from 'react';

export type IconName = keyof typeof icons;

export interface IconProps {
  name: IconName;
  color?: string;
  size?: number;
  stroke?: 'thin' | 'regular' | 'bold';
  style?: 'solid' | 'outline';
  fill?: string;
  absoluteStrokeWidth?: boolean;
  spin?: boolean;
}

const lucidStrokeWidth = {
  thin: 1.5,
  regular: 1.8,
  bold: 2.5,
};

export const LucidIcon = ({
  name,
  color,
  size = 18,
  stroke = 'regular',
  style = 'outline',
  fill = color,
  absoluteStrokeWidth = false,
  spin = false,
}: IconProps) => {
  const Icon = icons[name];

  const iconProps = useMemo(() => {
    const common = {
      color,
      size,
    };

    if (style === 'solid') {
      return {
        ...common,
        strokeWidth: 0,
        fill,
        absoluteStrokeWidth,
      };
    }

    return {
      ...common,
      strokeWidth: lucidStrokeWidth[stroke],
      absoluteStrokeWidth,
    };
  }, [color, size, style, stroke, fill, absoluteStrokeWidth]);

  return (
    <Icon
      {...iconProps}
      style={spin ? { animation: 'spin 1s linear infinite' } : undefined}
    />
  );
};
