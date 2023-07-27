export interface RadioTypes {
  inputId: string;
  label: string;
  value: string;
  checked?: boolean;
  filterData?: string;
}

export interface RadioAsyncComponentProps {
  loadOptions: () => RadioTypes[];
  id: string;
  legend: string;
  name: string;
  filter?: string;
  errorMessage?: string;
  hidden?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  limit?: number;
}

export interface RadioComponentProps {
  options: RadioTypes[];
  id: string;
  legend: string;
  name: string;
  filter?: string;
  errorMessage?: string;
  hidden?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  value: string;
  limit?: number;
}
