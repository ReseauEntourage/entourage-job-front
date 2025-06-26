import React, { useState } from 'react';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { IlluBulleQuestionCheck } from 'assets/icons/icons';
import { DashboardJoinWhatsappModal } from '../DashboardJoinWhatsappModal/DashboardJoinWhatsappModal';
import { openModal } from 'src/components/modals/Modal';
import { Button } from 'src/components/utils';
import { Alert } from 'src/components/utils/Alert';
import { StyledAlertContent } from './DashboardAlertWhatsapp.styles';

export const DashboardAlertWhatsapp = () => {
  const [alertVisible, setAlertVisible] = useState(true);
  const { role } = useAuthenticatedUser();
  const openJoinWhatsappModal = () => {
    openModal(<DashboardJoinWhatsappModal />);
  };

  return (
    <Alert
      icon={<IlluBulleQuestionCheck width={35} height={30} />}
      closable
      visible={alertVisible}
      onClose={() => {
        setAlertVisible(false);
      }}
    >
      <StyledAlertContent>
        Pour recevoir des actualités et échanger avec les{' '}
        {role === UserRoles.COACH ? 'coachs' : 'candidats'} de votre région,
        rejoignez le groupe Whatsapp
        <Button
          variant="secondary"
          rounded
          size="small"
          onClick={openJoinWhatsappModal}
        >
          Rejoindre le groupe Whatsapp
        </Button>
      </StyledAlertContent>
    </Alert>
  );
};
