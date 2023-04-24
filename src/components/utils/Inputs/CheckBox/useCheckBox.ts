import { useState, useCallback } from 'react';

export function useCheckBox(callback, params, defaultChecked) {
  const [checked, setChecked] = useState(defaultChecked);
  const handleCheckBox = useCallback(() => {
    if (callback) {
      callback(params);
    }
    setChecked(!checked);
  }, [callback, checked, params]);
  return { checked, handleCheckBox };
}
