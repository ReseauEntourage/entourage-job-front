import React, { useContext } from 'react';
import { Text, Button, Dropdown, Tooltip } from '@/src/components/ui';
import { DropdownContext } from '@/src/components/ui/Dropdown/Dropdown.context';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import { COLORS } from '@/src/constants/styles';
import { useProfileShare } from '@/src/hooks/useProfileShare';
import { HeaderIconButton } from '../MessagingConversationHeader.styles';

const SHARE_LABEL = 'Partager le profil';

interface MessagingShareNetworkProps {
  profileId: string;
  firstName: string;
  /**
   * Shows the toggle as an icon only (mobile), named by its accessible label
   * and by a tooltip where the device can hover. Defaults to the text button.
   */
  iconOnly?: boolean;
}

// Lives inside the `Dropdown` to tell assistive technologies when the menu is open
const ShareIconToggle = ({ disabled }: { disabled: boolean }) => {
  const { isOpen } = useContext(DropdownContext);

  return (
    <Tooltip content={SHARE_LABEL} openOnFocus hoverOnly disabled={isOpen}>
      <HeaderIconButton
        icon={<LucidIcon name="Share" />}
        variant="text"
        size="large"
        color={COLORS.teal}
        ariaLabel={SHARE_LABEL}
        ariaHasPopup="menu"
        ariaExpanded={isOpen}
        disabled={disabled}
        dataTestId="messaging-share-network-toggle"
      />
    </Tooltip>
  );
};

export const MessagingShareNetwork = ({
  profileId,
  firstName,
  iconOnly = false,
}: MessagingShareNetworkProps) => {
  const { handleWhatsappShare, handleLinkedinShare, isWhatsappLoading } =
    useProfileShare({ profileId, firstName });

  return (
    <Dropdown>
      <Dropdown.Toggle>
        {iconOnly ? (
          <ShareIconToggle disabled={isWhatsappLoading} />
        ) : (
          <Button
            size="small"
            prependIcon={<LucidIcon name="Share" />}
            disabled={isWhatsappLoading}
            rounded={false}
            dataTestId="messaging-share-network-toggle"
          >
            {SHARE_LABEL}
          </Button>
        )}
      </Dropdown.Toggle>
      {/* The icon sits at the right of the header: the menu opens towards the left, and stays narrow to fit a 320 px screen */}
      <Dropdown.Menu
        size={iconOnly ? 'small' : 'large'}
        openDirection={iconOnly ? 'left' : 'right'}
      >
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
