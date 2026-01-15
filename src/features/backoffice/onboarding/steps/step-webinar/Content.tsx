import React, { useCallback, useEffect } from 'react';
import { Api } from '@/src/api';
import { Event } from '@/src/api/types';
import { H4 } from '@/src/components/ui/Headings';
import {
  RadioGroup,
  Option,
} from '@/src/components/ui/ListGroup/RadioGroup/RadioGroup';
import { Skelton } from '@/src/components/ui/Skelton/Skelton';
import { EventType } from '@/src/constants/events';
import { WebinarOptionLabel } from './WebinarOptionLabel/WebinarOptionLabel';

export interface ContentProps {
  webinarSfId: string | null;
  onChange: (value: string) => void;
}

export const Content = ({ webinarSfId, onChange }: ContentProps) => {
  const [options, setOptions] = React.useState<Option[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const fetchWebinarOptions = useCallback(async () => {
    const response = await Api.getAllEvents({
      eventTypes: [EventType.WELCOME_SESSION],
      limit: 6,
      offset: 0,
      departmentIds: [],
    });
    setOptions(
      response.data.map((event: Event) => ({
        content: <WebinarOptionLabel event={event} />,
        value: event.salesForceId,
      }))
    );
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchWebinarOptions();
  }, [fetchWebinarOptions]);

  return (
    <>
      <H4 title="Séléctionnez la date qui vous convient le mieux" />
      <br />
      {isLoading && <Skelton height="90px" />}
      {!isLoading && options.length > 0 && (
        <RadioGroup
          radioSize="large"
          options={options}
          selection={webinarSfId}
          onChange={onChange}
        />
      )}
    </>
  );
};
