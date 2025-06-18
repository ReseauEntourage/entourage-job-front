import { useRef } from 'react';

export const useFileActivator = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setFileInputRef = (ref: HTMLInputElement | null) => {
    if (ref) {
      fileInputRef.current = ref;
    }
  };

  const requestFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return { fileInputRef, setFileInputRef, requestFileUploadClick };
};
