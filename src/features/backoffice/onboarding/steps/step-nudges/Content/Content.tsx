import React, { useEffect } from 'react';
import { SelectList } from '@/src/components/ui/Inputs/SelectList/SelectList';
import { SelectListType } from '@/src/components/ui/Inputs/SelectList/SelectList.types';
import { loadNudgesOptions } from '@/src/features/forms/utils/loadOptions.utils';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';

export const Content = () => {
  const user = useAuthenticatedUser();
  const [options, setOptions] = React.useState<SelectListType[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isIdle, setIsIdle] = React.useState<boolean>(true);

  useEffect(() => {
    if (isIdle) {
      loadNudgesOptions(user.role, (loadedOptions) => {
        setOptions(
          loadedOptions.map((option) => ({
            value: option.value,
            content: option.label,
          }))
        );
        setIsLoading(false);
        setIsIdle(false);
      });
    }
  }, [user.role, isIdle]);

  return (
    <SelectList
      id="nudgeIds"
      name="nudgeIds"
      value={[]}
      options={options}
      onChange={() => {}}
      isLoading={isLoading}
    />
  );
};
