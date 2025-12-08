import React from 'react';
import { StyledHeaderModal } from 'src/components/modals/Modal/Modals.styles';
import { Text } from 'src/components/utils';
import { H3 } from 'src/components/utils/Headings';

export const HeaderModal = ({
  title,
  description,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
}) => {
  if (!title && !description) {
    return null;
  }
  return (
    <StyledHeaderModal>
      {title && <H3 title={title} weight="semibold" center />}
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
