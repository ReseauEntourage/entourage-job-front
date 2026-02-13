import React, { useMemo } from 'react';
import { CardList } from '@/src/components/ui/CardList';
import { DirectoryEventItem } from '../../directory/DirectoryItem/DirectoryEventItem';
import { useEventDirectory } from '../useEventDirectory';
import { StyledEventDirectoryListContainer } from './EventDirectoryList.styles';

export function EventDirectoryList() {
  const { events, isEventLoading } = useEventDirectory();
  const listItems = useMemo(() => {
    return events.map((event) => {
      return <DirectoryEventItem key={event.salesForceId} {...event} />;
    });
  }, [events]);

  return (
    <StyledEventDirectoryListContainer>
      <CardList list={listItems} isLoading={isEventLoading} />
    </StyledEventDirectoryListContainer>
  );
}
