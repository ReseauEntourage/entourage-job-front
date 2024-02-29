import React from 'react';
import { FilterConstant } from 'src/constants/utils';

export type SelectListType = FilterConstant<string> & {
  icon: React.ReactNode;
  description: string;
};
