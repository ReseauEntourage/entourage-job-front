import React from 'react';
import { CloseButton, Text } from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import {
  StyledHeaderModal,
  StyledHeaderModalTitleContainer,
  StyledHeaderModalTop,
} from '@/src/features/modals/Modal/Modals.styles';
import { useModalContext } from '../ModalContext';

export const HeaderModal = ({
  title,
  description,
  onClose: customOnClose,
  noCloseIcon = false,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  onClose?: (onClose?: () => void) => void;
  noCloseIcon?: boolean;
}) => {
  const { onClose } = useModalContext();

  if (!title && !description) {
    return null;
  }
  return (
    <StyledHeaderModal>
      <StyledHeaderModalTop>
        {title && (
          <StyledHeaderModalTitleContainer>
            <H2 title={title} weight="semibold" center />
          </StyledHeaderModalTitleContainer>
        )}
        {!noCloseIcon && (
          <CloseButton
            dataTestId="generic-close-modal"
            onClick={() => {
              if (customOnClose) {
                customOnClose(onClose);
              } else {
                onClose?.();
              }
            }}
          />
        )}
      </StyledHeaderModalTop>
      {description && (
        <Text color="mediumGray" size="large" weight="normal" center>
          {description}
        </Text>
      )}
    </StyledHeaderModal>
  );
};

HeaderModal.defaultProps = {
  description: '',
};
