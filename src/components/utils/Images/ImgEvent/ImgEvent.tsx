import React, { useMemo } from 'react';
import { LegacyImg } from '@/src/components/utils/Images/LegacyImg';
import { EVENT_IMAGES, EventType } from '@/src/constants/events';
import { StyledImgContainer } from './ImgEvent.styles';

interface ImgEventProps {
  eventType: EventType;
  alt: string;
  width?: number;
  height?: number;
}

export const ImgEvent = ({
  eventType,
  alt,
  width = 150,
  height = 150,
}: ImgEventProps) => {
  const image = useMemo(() => {
    return EVENT_IMAGES[eventType] || EVENT_IMAGES[EventType.UNKNOWN];
  }, [eventType]);
  return (
    <StyledImgContainer width={width} height={height}>
      <LegacyImg src={image} alt={alt} cover />
    </StyledImgContainer>
  );
};
