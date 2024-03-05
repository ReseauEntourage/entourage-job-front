import React from 'react';
import { FilterConstant } from 'src/constants/utils';

export type SelectCardType<T extends string = string> = FilterConstant<T> & {
  bullets: {
    label: string;
    icon: React.ReactNode;
  }[];
  description: string;
};
