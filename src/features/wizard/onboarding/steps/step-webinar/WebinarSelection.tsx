import React, { useCallback, useEffect } from 'react';
import { Api } from '@/src/api';
import { Event } from '@/src/api/types';
import { SelectList } from '@/src/components/ui/Inputs/SelectList';
import { SelectListGroup } from '@/src/components/ui/Inputs/SelectList/SelectList.types';
import { SelectOptionWebinarLabel } from '@/src/components/ui/Inputs/SelectList/SelectListOptionLabels/SelectOptionWebinarLabel/SelectOptionWebinarLabel';
import { EventMode, EventType } from '@/src/constants/events';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { WebinarSelectGroupLabel } from './WebinarSelectGroupLabel';

interface WebinarSelectionProps {
  webinarSfId: string | null;
  onChange: (value: string) => void;
}

export const WebinarSelection = ({
  webinarSfId,
  onChange,
}: WebinarSelectionProps) => {
  const [options, setOptions] = React.useState<SelectListGroup<string>[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isIdle, setIsIdle] = React.useState<boolean>(true);
  const userProfile = useCurrentUserProfile();

  const fetchNextWebinarOptions = useCallback(async () => {
    const fetchUserDepartmentId = async (): Promise<string | null> => {
      const extractedDepartmentCode =
        userProfile?.department?.match(/\(([^)]+)\)/)?.[1] || null;

      if (!extractedDepartmentCode) {
        return null;
      }
      const departments = await Api.getAllDepartments({
        search: extractedDepartmentCode,
      });
      if (departments.data.length > 0) {
        return departments.data[0].id;
      }
      return null;
    };
    const currentUserDepartementId = await fetchUserDepartmentId();

    const response = await Api.getAllEvents({
      eventTypes: [EventType.WELCOME_SESSION, EventType.COFFEE_SESSION],
      limit: 6,
      offset: 0,
      departmentIds: currentUserDepartementId ? [currentUserDepartementId] : [],
    });
    const toOption = (event: Event) => ({
      value: event.salesForceId,
      label: <SelectOptionWebinarLabel event={event} />,
    });

    const onlineEvents = response.data.filter(
      (e: Event) => e.mode !== EventMode.IN_PERSON
    );
    const inPersonEvents = response.data.filter(
      (e: Event) => e.mode === EventMode.IN_PERSON
    );

    const groups: SelectListGroup<string>[] = [];
    if (onlineEvents.length > 0) {
      groups.push({
        label: <WebinarSelectGroupLabel icon="Laptop" label="À distance" />,
        options: onlineEvents.map(toOption),
      });
    }
    if (inPersonEvents.length > 0) {
      groups.push({
        label: <WebinarSelectGroupLabel icon="MapPin" label="En présentiel" />,
        options: inPersonEvents.map(toOption),
      });
    }
    setOptions(groups);
    setIsLoading(false);
    setIsIdle(false);
  }, [userProfile?.department]);

  useEffect(() => {
    if (isIdle) {
      fetchNextWebinarOptions();
    }
  }, [fetchNextWebinarOptions, isIdle]);

  return (
    <SelectList
      id="webinarSfId"
      name="webinarSfId"
      title="Sélectionnez la date qui vous convient le mieux"
      options={options}
      value={webinarSfId ? [webinarSfId] : []}
      onChange={(value) => {
        onChange(value[0] ?? '');
      }}
      isMulti={false}
      isLoading={isLoading}
      estimatedOptionLength={6}
    />
  );
};
