import React from 'react';
import { FilterConstant } from '@/src/constants/utils';
import { CommonInputProps } from '../Inputs.types';

export type RadioVariant = 'default' | 'cards';

export interface RadioTypes extends FilterConstant<string> {
  inputId: string;
  checked?: boolean;
  filterData?: string;
}

export interface RadioAsyncComponentProps extends CommonInputProps<
  string,
  HTMLInputElement
> {
  loadOptions: (callback: (options: RadioTypes[]) => void) => void;
  filter?: string;
  errorMessage?: string;
  limit?: number;
}

export interface RadioComponentProps extends CommonInputProps<
  string,
  HTMLInputElement
> {
  options: RadioTypes[];
  optionsToDisable?: { message: React.ReactNode; option: string }[];
  subtitle?: string;
  filter?: string;
  limit?: number;
  /**
   * `default`: options listed one below the other.
   * `cards`: each option is a boxed, clickable card, on two columns (one
   * below the desktop breakpoint).
   */
  variant?: RadioVariant;
}
