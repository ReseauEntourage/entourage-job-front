import React from 'react';
import { useIsDesktop } from 'src/hooks/utils';
import { AnyCantFix } from "./Types";

interface PlateformParams<T> {
  Desktop?: T;
  Mobile?: T;
}

export function plateform<T extends React.ComponentType<AnyCantFix>>(data: PlateformParams<T>): T {
  const { Mobile, Desktop } = data;
  
  // @ts-expect-error ignore type error because return statement is already typed
  return (props: React.ComponentProps<typeof T>) => {
    const isDesktop = useIsDesktop();

    if (isDesktop) {
      return Desktop ? <Desktop {...props} /> : null;
    }

    return Mobile ? <Mobile {...props} /> : null;
  };
}
