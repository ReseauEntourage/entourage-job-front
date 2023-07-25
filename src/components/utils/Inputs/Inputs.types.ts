import { ChangeEvent, Ref } from 'react';
import { FieldError } from 'react-hook-form';

export interface CommonInputProps<T, K extends HTMLElement, O = void> {
  id: string;
  name: string;
  title: string;
  value: T;
  onChange: (e: O extends void ? ChangeEvent<K> : O) => void;
  onBlur?: () => void;
  error?: FieldError;
  disabled?: boolean;
  hidden?: boolean;
  showLabel?: boolean;
  placeholder?: string;
  inputRef?: Ref<K>;
}
