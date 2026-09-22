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
  align = 'center',
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  onClose?: (onClose?: () => void) => void;
  noCloseIcon?: boolean;
  /** Titre et description centrés, ou alignés à gauche. */
  align?: 'center' | 'left';
}) => {
  const { onClose } = useModalContext();

  if (!title && !description) {
    return null;
  }
  return (
    <StyledHeaderModal>
      <StyledHeaderModalTop>
        {title && (
          <StyledHeaderModalTitleContainer $align={align}>
            <H2 title={title} weight="semibold" center={align === 'center'} />
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
        <Text
          color="mediumGray"
          size="large"
          weight="normal"
          center={align === 'center'}
        >
          {description}
        </Text>
      )}
    </StyledHeaderModal>
  );
};

HeaderModal.defaultProps = {
  description: '',
};
