import React from 'react';
import { FilterConstant } from 'src/constants/utils';

export type SelectListType<T extends string = string> = FilterConstant<T>;

export type SelectListGroup<T extends string = string> = {
  label: React.ReactNode;
  options: SelectListType<T>[];
};

export type SelectListOptions<T extends string = string> =
  | SelectListType<T>[]
  | SelectListGroup<T>[];

export function isGroupedOptions<T extends string>(
  options: SelectListOptions<T>
): options is SelectListGroup<T>[] {
  return options.length > 0 && 'options' in options[0];
}

export type SelectOptionTitleIconDescriptionLabelType<
  T extends string = string
> = SelectListType<T> & {
  icon: React.ReactNode;
  description: string;
};
