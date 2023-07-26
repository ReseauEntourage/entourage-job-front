import { Component, Ref } from 'react';
import { FieldError } from 'react-hook-form';
import { AnyToFix } from 'src/utils/Types';

export interface CommonInputProps<
  T = AnyToFix,
  K extends HTMLElement | Component = AnyToFix
> {
  id: string;
  name: string;
  title: string;
  value: T;
  onChange: (value: T) => void;
  onBlur?: () => void;
  error?: FieldError;
  disabled?: boolean;
  hidden?: boolean;
  showLabel?: boolean;
  placeholder?: string;
  inputRef?: Ref<K>;
}
