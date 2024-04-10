import { Component, RefCallback } from 'react';
import { FieldError } from 'react-hook-form';
import { AnyCantFix } from 'src/utils/Types';

export interface CommonInputProps<
  T,
  K extends HTMLElement | Component = AnyCantFix
> {
  id: string;
  name: string;
  title?: string | JSX.Element;
  value: T;
  onChange: (value: T) => void;
  onBlur?: () => void;
  error?: FieldError;
  disabled?: boolean;
  hidden?: boolean;
  showLabel?: boolean;
  placeholder?: string;
  inputRef?: RefCallback<K>;
}
