import { icons } from 'lucide-react';

import React from 'react';

export interface IconProps {
  name: keyof typeof icons;
  color?: string;
  size?: number;
  stroke?: 'thin' | 'regular' | 'bold';
  style?: 'solid' | 'outline';
  fill?: string;
}

export const LucidIcon = ({
  name,
  color,
  size = 18,
  stroke = 'regular',
  style = 'outline',
  fill = color,
}: IconProps) => {
  const Icon = icons[name];

  const lucidStrokeWidth = {
    thin: 1.3,
    regular: 2,
    bold: 2.7,
  };

  if (style === 'solid') {
    return <Icon color={color} size={size} strokeWidth={0} fill={fill} />;
  }

  return (
    <Icon color={color} size={size} strokeWidth={lucidStrokeWidth[stroke]} />
  );
};
