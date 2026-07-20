import { Component, RefCallback, type JSX, ReactNode } from 'react';
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
  errorContent?: ReactNode;
  disabled?: boolean;
  hidden?: boolean;
  showLabel?: boolean;
  showOptional?: boolean;
  labelTooltip?: ReactNode;
  placeholder?: string;
  inputRef?: RefCallback<K>;
}
