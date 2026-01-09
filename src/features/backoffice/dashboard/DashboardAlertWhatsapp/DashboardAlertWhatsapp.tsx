import React, { useState } from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { Button } from '@/src/components/ui';
import { Alert } from '@/src/components/ui/Alert';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { DashboardJoinWhatsappModal } from '../DashboardJoinWhatsappModal/DashboardJoinWhatsappModal';
import { StyledAlertContent } from './DashboardAlertWhatsapp.styles';

export const DashboardAlertWhatsapp = () => {
  const [alertVisible, setAlertVisible] = useState(true);
  const { role } = useAuthenticatedUser();
  const openJoinWhatsappModal = () => {
    openModal(<DashboardJoinWhatsappModal />);
  };

  return (
    <Alert
      icon={<SvgIcon name="IlluBulleQuestionCheck" width={35} height={30} />}
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
