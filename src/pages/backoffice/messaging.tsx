import React from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { Messaging } from 'src/components/backoffice/messaging';

const Messages = () => {
  return (
    <LayoutBackOffice title="Messagerie">
      <Messaging />
    </LayoutBackOffice>
  );
};

export default Messages;
