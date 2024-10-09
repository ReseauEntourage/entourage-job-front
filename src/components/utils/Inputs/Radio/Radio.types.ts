import { CommonInputProps } from '../Inputs.types';
import { FilterConstant } from 'src/constants/utils';

export interface RadioTypes extends FilterConstant<string> {
  inputId: string;
  checked?: boolean;
  filterData?: string;
}

export interface RadioAsyncComponentProps
  extends CommonInputProps<string, HTMLInputElement> {
  loadOptions: (callback: (options: RadioTypes[]) => void) => void;
  filter?: string;
  errorMessage?: string;
  limit?: number;
}

export interface RadioComponentProps
  extends CommonInputProps<string, HTMLInputElement> {
  options: RadioTypes[];
  subtitle?: string;
  filter?: string;
  limit?: number;
}
