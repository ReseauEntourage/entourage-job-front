import React, { useCallback, useEffect, useState } from 'react';
import { CommonInputProps } from '../Inputs.types';
import { SelectList } from './SelectList';
import { SelectListType } from './SelectList.types';

export interface SelectListAsyncProps<T extends string>
  extends CommonInputProps<T[], HTMLElement> {
  id: string;
  isMulti?: boolean;
  loadOptions: (
    callback: (options: SelectListType<T>[]) => void,
    inputValue: string
  ) => void;
}

export const SelectListAsync = <T extends string>(
  props: SelectListAsyncProps<T>
) => {
  const { loadOptions } = props;
  const [defaultOptions, setDefaultOptions] = useState<SelectListType<T>[]>([]);

  const fetchListOptions = useCallback(() => {
    setDefaultOptions([] as SelectListType<T>[]);
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
