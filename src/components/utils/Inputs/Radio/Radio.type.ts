export interface RadioType {
  inputId: string;
  label: string;
  value: string;
  checked?: boolean;
  filterData?: string;
}

export interface RadioAsyncComponentType {
  loadOptions: () => RadioType[];
  id: string;
  legend: string;
  name: string;
  filter?: string;
  errorMessage?: string;
  hidden?: boolean;
  onChange: (
    e: React.MouseEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>
  ) => void;
}

export interface RadioComponentType {
  options: RadioType[];
  id: string;
  legend: string;
  name: string;
  filter?: string;
  errorMessage?: string;
  hidden?: boolean;
  onChange: (
    e: React.MouseEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>
  ) => void;
}
