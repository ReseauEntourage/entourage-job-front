import React, { useState } from 'react';
import { useMount } from 'src/hooks/utils';
import { Radio } from './Radio';
import { RadioAsyncComponentType } from './Radio.types';

export function RadioAsync({
  loadOptions,
  id,
  legend,
  name,
  onChange,
  filter,
  errorMessage,
  hidden,
  value,
}: RadioAsyncComponentType) {
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
          legend={legend}
          name={name}
          onChange={onChange}
          filter={filter}
          options={options}
          hidden={hidden}
          errorMessage={errorMessage}
          value={value}
        />
      )}
    </>
  );
}
