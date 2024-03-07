import React, { useState } from 'react';
import { Spinner } from 'src/components/utils/Spinner';
import { useMount } from 'src/hooks/utils';
import { Radio } from './Radio';
import {
  StyledRadioContainer,
  StyledRadioSpinnerContainer,
} from './Radio.styles';
import { RadioAsyncComponentProps } from './Radio.types';

export function RadioAsync({
  loadOptions,
  id,
  title,
  name,
  onChange,
  filter,
  errorMessage,
  error,
  disabled = false,
  hidden = false,
  value,
  inputRef,
  limit,
}: RadioAsyncComponentProps) {
  const [options, setOptions] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useMount(() => {
    loadOptions((optionsLoaded) => {
      setOptions(
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        optionsLoaded
      );
      setIsLoading(false);
    });
  });

  if (hidden) {
    return null;
  }

  if (isLoading) {
    return (
      <StyledRadioSpinnerContainer>
        <Spinner />
      </StyledRadioSpinnerContainer>
    );
  }

  if (options.length === 0) {
    return (
      <StyledRadioContainer>
        <legend>{errorMessage}</legend>
      </StyledRadioContainer>
    );
  }

  return (
    <Radio
      id={id}
      title={title}
      name={name}
      onChange={onChange}
      filter={filter}
      options={options}
      disabled={disabled}
      limit={limit}
      hidden={hidden}
      error={error}
      value={value}
      inputRef={inputRef}
    />
  );
}
