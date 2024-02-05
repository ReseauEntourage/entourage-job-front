import { useState, useCallback } from 'react';

export function useCheckBox<T>(
  params: T,
  callback: ((args: T) => void) | undefined,
  defaultChecked = false
) {
  const [checked, setChecked] = useState(defaultChecked);
  const handleCheckBox = useCallback(() => {
    if (callback) {
      callback(params);
    }
    setChecked(!checked);
  }, [callback, checked, params]);
  return { checked, handleCheckBox };
}
