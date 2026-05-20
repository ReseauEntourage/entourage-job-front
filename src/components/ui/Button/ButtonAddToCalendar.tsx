import React, { useCallback } from 'react';
import { EventMode } from 'src/constants/events';
import { downloadICS, generateICSContent } from 'src/utils/ics';
import { Button } from './Button';
import { ButtonProps } from './Button.types';

interface ButtonAddToCalendarProps extends Omit<ButtonProps, 'onClick'> {
  id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  mode: EventMode;
  meetingLink: string | null;
  fullAddress: string | null;
}

export const ButtonAddToCalendar = ({
  id,
  title,
  description,
  startDate,
  endDate,
  mode,
  meetingLink,
  fullAddress,
  children,
  ...props
}: ButtonAddToCalendarProps) => {
  const handleClick = useCallback(() => {
    const content = generateICSContent({
      id,
      title,
      description,
      startDate,
      endDate,
      mode,
      meetingLink,
      fullAddress,
    });
    const safeFilename =
      title
        .replace(/[^a-z0-9]/gi, '-')
        .toLowerCase()
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'event';
    downloadICS(content, `${safeFilename}.ics`);
  }, [
    id,
    title,
    description,
    startDate,
    endDate,
    mode,
    meetingLink,
    fullAddress,
  ]);

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
};
