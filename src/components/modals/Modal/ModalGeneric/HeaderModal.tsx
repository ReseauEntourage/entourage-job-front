import React from 'react';
import { useModalContext } from '../ModalContext';
import {
  StyledHeaderModal,
  StyledHeaderModalTitleContainer,
  StyledHeaderModalTop,
} from 'src/components/modals/Modal/Modals.styles';
import { CloseButton, Text } from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';

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
