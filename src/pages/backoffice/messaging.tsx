import React from 'react';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { Messaging } from '@/src/features/backoffice/messaging';

const Messages = () => {
  return (
    <LayoutBackOffice title="Messagerie">
      <Messaging />
    </LayoutBackOffice>
  );
};

export default Messages;
