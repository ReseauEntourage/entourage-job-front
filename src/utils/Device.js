import React from 'react';
import { useIsDesktop } from 'src/hooks/utils';

export function plateform(data) {
  const { Mobile, Desktop } = data;

  return (props) => {
    const isDesktop = useIsDesktop();

    if (isDesktop) {
      return Desktop ? <Desktop {...props} /> : null;
    }

    return Mobile ? <Mobile {...props} /> : null;
  };
}
