import React from 'react';
import { useIsDesktop } from 'src/hooks/utils';
import { AnyCantFix } from './Types';

interface PlateformParams<T> {
  Desktop?: T;
  Mobile?: T;
}

export const platform = <T extends React.ComponentType<AnyCantFix>>(
  data: PlateformParams<T>
): React.FC<React.ComponentProps<T>> => {
  const { Mobile, Desktop } = data;

  return (props: React.ComponentProps<T>) => {
    const isDesktop = useIsDesktop();

    if (isDesktop) {
      return Desktop ? <Desktop {...props} /> : null;
    }

    return Mobile ? <Mobile {...props} /> : null;
  };
};
