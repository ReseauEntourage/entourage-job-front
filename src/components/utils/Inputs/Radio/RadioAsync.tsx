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
  hidden,
  value,
  limit,
}: RadioAsyncComponentProps) {
  const [options, setOptions] = useState([]);

  useMount(async () => {
    const optionsLoaded = await loadOptions();
    setOptions(optionsLoaded);
  });

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
          limit={limit}
          hidden={hidden}
          errorMessage={errorMessage}
          value={value}
        />
      )}
    </>
  );
}
