import React, { useCallback, useEffect } from 'react';
import { Api } from '@/src/api';
import { Event } from '@/src/api/types';
import { H4 } from '@/src/components/ui/Headings';
import { SelectList } from '@/src/components/ui/Inputs/SelectList';
import { SelectListType } from '@/src/components/ui/Inputs/SelectList/SelectList.types';
import { SelectOptionWebinarLabel } from '@/src/components/ui/Inputs/SelectList/SelectListOptionLabels/SelectOptionWebinarLabel/SelectOptionWebinarLabel';
import { EventType } from '@/src/constants/events';

export interface ContentProps {
  webinarSfId: string | null;
  onChange: (value: string) => void;
}

export const Content = ({ webinarSfId, onChange }: ContentProps) => {
  const [options, setOptions] = React.useState<SelectListType<string>[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isIdle, setIsIdle] = React.useState<boolean>(true);

  const fetchNextWebinarOptions = useCallback(async () => {
    const response = await Api.getAllEvents({
      eventTypes: [EventType.WELCOME_SESSION],
      limit: 6,
      offset: 0,
      departmentIds: [],
    });
    setOptions(
      response.data.map((event: Event) => ({
        value: event.salesForceId,
        label: <SelectOptionWebinarLabel event={event} />,
      }))
    );
    setIsLoading(false);
    setIsIdle(false);
  }, []);

  useEffect(() => {
    if (isIdle) {
      fetchNextWebinarOptions();
    }
  }, [fetchNextWebinarOptions, isIdle]);

  return (
    <>
      <H4 title="Séléctionnez la date qui vous convient le mieux" />
      <br />
      <SelectList
        id="webinarSfId"
        name="webinarSfId"
        title="Sélectionnez la date qui vous convient le mieux"
        options={options}
        value={webinarSfId ? [webinarSfId] : []}
        onChange={(value) => onChange(value[0] ?? '')}
        isLoading={isLoading}
        estimatedOptionLength={6}
      />
    </>
  );
};
