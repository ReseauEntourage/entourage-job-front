import React, { useState } from 'react';
import { useMount } from 'src/hooks/utils';
import { Radio } from './Radio';
import { RadioAsyncComponentProps } from './Radio.types';

export function RadioAsync({
  loadOptions,
  id,
  title,
  name,
  onChange,
  filter,
  errorMessage,
  disabled = false,
  hidden = false,
  value,
  inputRef,
  limit,
}: RadioAsyncComponentProps) {
  const [options, setOptions] = useState([]);

  useMount(() => {
    loadOptions((optionsLoaded) => {
      setOptions(
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        optionsLoaded
      );
    });
  });

  if (hidden) {
    return null;
  }

  return (
    <>
      {options?.length > 0 && (
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
          errorMessage={errorMessage}
          value={value}
          inputRef={inputRef}
        />
      )}
    </>
  );
}
