import React from 'react';
import { Text, Button, Dropdown } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import { COLORS } from '@/src/constants/styles';
import { useProfileShare } from '@/src/hooks/useProfileShare';

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
    <Dropdown>
      <Dropdown.Toggle>
        <Button
          size="small"
          prependIcon={<LucidIcon name="Share" />}
          disabled={isWhatsappLoading}
          rounded={false}
        >
          Partager le profil
        </Button>
      </Dropdown.Toggle>
      <Dropdown.Menu size="large">
        <Dropdown.Item onClick={handleLinkedinShare}>
          <Text size="small">
            <SvgIcon
              name="LinkedIn"
              width={14}
              height={14}
              color={COLORS.linkedInBlue}
            />{' '}
            Partager sur LinkedIn
          </Text>
        </Dropdown.Item>
        <Dropdown.Item onClick={handleWhatsappShare}>
          <Text size="small">
            <SvgIcon
              name="Whatsapp"
              width={14}
              height={14}
              color={COLORS.whatsAppGreen}
            />{' '}
            Partager sur WhatsApp
          </Text>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
