import React from 'react';
import { FilterConstant } from 'src/constants/utils';

export type SelectListType<T extends string = string> = FilterConstant<T>;

export type SelectTitleIconDescriptionLabelType<T extends string = string> =
  SelectListType<T> & {
    icon: React.ReactNode;
    description: string;
  };
