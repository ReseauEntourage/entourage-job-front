import React from 'react';
import { Button, LucidIcon } from '@/src/components/ui';
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
      <span style={{ marginLeft: 8, marginRight: count && count > 0 ? 8 : 0 }}>
        Filtrer
      </span>
      {showCount && (
        <StyledMobileFilterItemCount>{count}</StyledMobileFilterItemCount>
      )}
    </Button>
  );
};
