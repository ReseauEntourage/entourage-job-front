import { CommonInputProps } from '../Inputs.types';

export interface RadioTypes {
  inputId: string;
  label: string;
  value: string;
  checked?: boolean;
  filterData?: string;
}

export interface RadioAsyncComponentProps
  extends CommonInputProps<string, HTMLInputElement> {
  loadOptions: () => Promise<RadioTypes[]>;
  filter?: string;
  errorMessage?: string;
  limit?: number;
}

export interface RadioComponentProps
  extends CommonInputProps<string, HTMLInputElement> {
  options: RadioTypes[];
  filter?: string;
  errorMessage?: string;
  limit?: number;
}
