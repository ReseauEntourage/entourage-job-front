import React from 'react';
import { FilterConstant } from 'src/constants/utils';

export type SelectListType<T extends string = string> = FilterConstant<T> & {
  icon: React.ReactNode;
  description: string;
};
