import React from 'react';
import { isSSR } from 'src/utils/isSSR';
import { BREAKPOINTS } from 'src/constants/styles';

export function plateform(data) {
  const { Mobile, Desktop } = data;

  let isDesktop = true;
  if (!isSSR) {
    const handleDevice = () => {
      console.log('resize');
      isDesktop = window.innerWidth >= BREAKPOINTS.desktop;
    };
    handleDevice();
    window.addEventListener('resize', handleDevice);
  }

  return (props) => {
    if (isDesktop) {
      return Desktop ? <Desktop {...props} /> : null;
    }

    return Mobile ? <Mobile {...props} /> : null;
  };
}
