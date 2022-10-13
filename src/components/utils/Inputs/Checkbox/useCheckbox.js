import { useState } from 'react';

export const useCheckbox = (callback, params) => {
  const [checked, setChecked] = useState(false);
  const handleCheckBox = () => {
    if (callback) {
      callback(params);
    }
    setChecked(!checked);
  };
  return { checked, handleCheckBox };
};
