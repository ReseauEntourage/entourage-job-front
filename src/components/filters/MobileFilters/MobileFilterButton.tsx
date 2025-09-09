import React from 'react';
import { Button } from '../../utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { StyledMobileFilterItemCount } from './MobileFilters.styles';

interface MobileFilterButtonProps {
  onClick: () => void;
  count?: number;
}

export const MobileFilterButton = ({
  onClick,
  count,
}: MobileFilterButtonProps) => {
  const showCount = !!(count && count > 0);
  return (
    <Button
      rounded
      variant="default"
      onClick={onClick}
      data-testid="mobile-filter-button"
      size="small"
    >
      <LucidIcon name="ListFilter" size={16} />
      <span style={{ marginLeft: 8 }}>
        Filtrer
        {showCount && (
          <StyledMobileFilterItemCount>{count}</StyledMobileFilterItemCount>
        )}
      </span>
    </Button>
  );
};
