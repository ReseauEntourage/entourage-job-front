import React, { useEffect, useState } from 'react';
import { Button } from 'src/components/utils/Button';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { Filter, FilterObject } from 'src/constants/utils';
import { MobileFilterList } from './MobileFilterList';
import { MobileFilterOptions } from './MobileFilterOptions';
import {
  StyledMobileFilterButtonsContainer,
  StyledMobileFilterContent,
  StyledMobileFilterDrawer,
  StyledMobileFilterFooter,
  StyledMobileFilterHeader,
  StyledMobileFilterOverlay,
  StyledMobileFilterTitle,
} from './MobileFilters.styles';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: () => void;
  filters: FilterObject;
  setFilters: (updatedFilters: FilterObject) => void;
  filterData: Filter[];
}

export const MobileFilterDrawer = ({
  isOpen,
  onClose,
  onApplyFilters,
  filters,
  setFilters,
  filterData,
}: MobileFilterDrawerProps) => {
  const [selectedFilterKey, setSelectedFilterKey] = useState<string | null>(
    null
  );

  // Réinitialiser le filtre sélectionné chaque fois que le tiroir est ouvert
  useEffect(() => {
    if (isOpen) {
      setSelectedFilterKey(null);
    }
  }, [isOpen]);

  const selectedFilter = selectedFilterKey
    ? filterData.find((filter) => filter.key === selectedFilterKey)
    : null;

  const handleBackToListOrClose = () => {
    if (selectedFilterKey) {
      setSelectedFilterKey(null);
    } else {
      onClose();
    }
  };

  const handleSelectFilter = (key: string) => {
    setSelectedFilterKey(key);
  };

  const handleApplyFilters = () => {
    onApplyFilters();
    onClose();
  };

  return (
    <>
      <StyledMobileFilterOverlay isOpen={isOpen} onClick={onClose} />
      <StyledMobileFilterDrawer isOpen={isOpen}>
        <StyledMobileFilterHeader>
          <Button
            variant="default"
            size="small"
            onClick={handleBackToListOrClose}
            dataTestId="mobile-filter-back-button"
          >
            <LucidIcon name="ArrowLeft" size={20} />
          </Button>
          <StyledMobileFilterTitle>
            {selectedFilterKey ? selectedFilter?.title : 'Filtres'}
          </StyledMobileFilterTitle>
        </StyledMobileFilterHeader>

        <StyledMobileFilterContent>
          {selectedFilterKey && selectedFilter ? (
            <MobileFilterOptions
              currentFilter={selectedFilter}
              filters={filters}
              setFilters={setFilters}
            />
          ) : (
            <MobileFilterList
              filters={filters}
              filterData={filterData}
              onSelectFilter={handleSelectFilter}
            />
          )}
        </StyledMobileFilterContent>

        <StyledMobileFilterFooter>
          <StyledMobileFilterButtonsContainer>
            <Button
              variant="primary"
              rounded
              onClick={handleApplyFilters}
              dataTestId="mobile-filter-apply-button"
            >
              Voir les résultats
            </Button>
          </StyledMobileFilterButtonsContainer>
        </StyledMobileFilterFooter>
      </StyledMobileFilterDrawer>
    </>
  );
};
