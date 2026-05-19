import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { ButtonIcon } from '@/src/components/ui';
import { COLORS } from '@/src/constants/styles';
import { useProfileShare } from '@/src/hooks/useProfileShare';
import { MessagingShareNetworkContainer } from './MessagingShareNetwork.styles';

interface MessagingShareNetworkProps {
  profileId: string;
  firstName: string;
}

export const MessagingShareNetwork = ({
  profileId,
  firstName,
}: MessagingShareNetworkProps) => {
  const { handleWhatsappShare, handleLinkedinShare, isWhatsappLoading } =
    useProfileShare({ profileId, firstName });

  return (
    <MessagingShareNetworkContainer>
      <span>Partager son profil :</span>
      <ButtonIcon
        icon={
          <SvgIcon
            name="LinkedIn"
            width={18}
            height={18}
            color={COLORS.linkedInBlue}
          />
        }
        color={COLORS.linkedInBlue}
        onClick={handleLinkedinShare}
        aria-label="Partager sur LinkedIn"
      />
      <ButtonIcon
        icon={<SvgIcon name="Whatsapp" width={18} height={18} />}
        color={COLORS.whatsAppGreen}
        onClick={handleWhatsappShare}
        disabled={isWhatsappLoading}
        aria-label="Partager sur WhatsApp"
      />
    </MessagingShareNetworkContainer>
  );
};
