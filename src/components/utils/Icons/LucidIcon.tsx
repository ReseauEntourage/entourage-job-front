import { icons } from 'lucide-react';

import React from 'react';

export type IconName = keyof typeof icons;

export interface IconProps {
  name: IconName;
  color?: string;
  size?: number;
  stroke?: 'thin' | 'regular' | 'bold';
  style?: 'solid' | 'outline';
  fill?: string;
  absoluteStrokeWidth?: boolean;
}

export const LucidIcon = ({
  name,
  color,
  size = 18,
  stroke = 'regular',
  style = 'outline',
  fill = color,
  absoluteStrokeWidth = false,
}: IconProps) => {
  const Icon = icons[name];

  const lucidStrokeWidth = {
    thin: 1.5,
    regular: 1.8,
    bold: 2.5,
  };

  if (style === 'solid') {
    return (
      <Icon
        color={color}
        size={size}
        strokeWidth={0}
        fill={fill}
        absoluteStrokeWidth={absoluteStrokeWidth}
      />
    );
  }

  return (
    <Icon color={color} size={size} strokeWidth={lucidStrokeWidth[stroke]} />
  );
};
