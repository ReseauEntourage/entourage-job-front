import React, { useEffect } from 'react';
import { SelectList } from '@/src/components/ui/Inputs/SelectList/SelectList';
import { SelectListType } from '@/src/components/ui/Inputs/SelectList/SelectList.types';
import { SelectOptionTitleIconDescriptionLabel } from '@/src/components/ui/Inputs/SelectList/SelectListOptionLabels/SelectOptionTitleIconDescriptionLabel/SelectOptionTitleIconDescriptionLabel';
import { UserRoles } from '@/src/constants/users';
import { loadNudgesOptions } from '@/src/features/forms/utils/loadOptions.utils';

export interface ContentProps {
  userRole: UserRoles;
  nudgeIds: string[];
  onChange: (nudgeIds: string[]) => void;
}

export const Content = ({ userRole, nudgeIds, onChange }: ContentProps) => {
  const [options, setOptions] = React.useState<SelectListType[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isIdle, setIsIdle] = React.useState<boolean>(true);

  useEffect(() => {
    if (isIdle) {
      loadNudgesOptions(userRole, (loadedOptions) => {
        setOptions(
          loadedOptions.map((option) => ({
            value: option.value,
            label: (
              <SelectOptionTitleIconDescriptionLabel
                title={option.label}
                icon={option.icon}
                description={option.description}
              />
            ),
          }))
        );
        setIsLoading(false);
        setIsIdle(false);
      });
    }
  }, [userRole, isIdle]);

  return (
    <SelectList
      id="nudgeIds"
      name="nudgeIds"
      title="Sélectionnez les coups de pouces"
      options={options}
      value={nudgeIds}
      onChange={onChange}
      isLoading={isLoading}
      estimatedOptionLength={5}
    />
  );
};
