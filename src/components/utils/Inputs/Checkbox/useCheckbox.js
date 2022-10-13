import { useState, useCallback } from 'react';

export const useCheckbox = (callback, params) => {
  const [checked, setChecked] = useState(false);
  const handleCheckBox = useCallback(() => {
    if (callback) {
      callback(params);
    }
    setChecked(!checked);
  }, [callback, checked, params]);
  return { checked, handleCheckBox };
};
