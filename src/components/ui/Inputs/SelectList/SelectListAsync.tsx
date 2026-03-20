import React, { useCallback, useEffect, useState } from 'react';
import { CommonInputProps } from '../Inputs.types';
import { SelectList, SelectListOptions } from '.';

export interface SelectListAsyncProps<T extends string>
  extends CommonInputProps<T[], HTMLElement> {
  id: string;
  isMulti?: boolean;
  loadOptions: (
    callback: (options: SelectListOptions<T>) => void,
    inputValue: string
  ) => void;
}

export const SelectListAsync = <T extends string>(
  props: SelectListAsyncProps<T>
) => {
  const { loadOptions } = props;
  const [defaultOptions, setDefaultOptions] = useState<SelectListOptions<T>>(
    []
  );

  const fetchListOptions = useCallback(() => {
    setDefaultOptions([]);
    loadOptions((options) => {
      setDefaultOptions(options);
    }, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchListOptions();
  }, [fetchListOptions]);

  return <SelectList {...props} options={defaultOptions} />;
};
