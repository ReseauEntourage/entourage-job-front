import React, { useState } from 'react';
import { IlluBulleQuestionCheck } from 'assets/icons/icons';
import { DashboardJoinWhatsappCoachModal } from '../DashboardJoinWhatsappCoachModal/DashboardJoinWhatsappCoachModal';
import { openModal } from 'src/components/modals/Modal';
import { Button } from 'src/components/utils';
import { Alert } from 'src/components/utils/Alert';
import { StyledAlertContent } from './DashboardAlertWhatsappCoach.styles';

export const DashboardAlertWhatsappCoach = () => {
  const [alertVisible, setAlertVisible] = useState(true);
  const openJoinWhatsappModal = () => {
    openModal(<DashboardJoinWhatsappCoachModal />);
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
        Pour recevoir des actualités et échanger avec les coachs de votre
        région, rejoignez le groupe Whatsapp
        <Button
          color="primaryBlue"
          style="custom-secondary"
          size="small"
          onClick={openJoinWhatsappModal}
        >
          Rejoindre le groupe Whatsapp
        </Button>
      </StyledAlertContent>
    </Alert>
  );
};
