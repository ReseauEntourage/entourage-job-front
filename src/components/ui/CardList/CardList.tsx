import React, { type JSX } from 'react';
import { StyledNoResult } from '@/src/features/backoffice/Backoffice.styles';
import { Spinner } from '../Spinner';
import {
  StyledCardList,
  StyledCardListContainer,
  StyledCardListSpinnerContainer,
} from './CardList.styles';

interface CardListProps {
  list: JSX.Element[];
  isLoading?: boolean;
  dataTestId?: string;
  condensed?: boolean;
}

export function CardList({
  list,
  isLoading = false,
  condensed = false,
  dataTestId,
}: CardListProps) {
  return (
    <StyledCardListContainer>
      <StyledCardList data-testid={dataTestId} condensed={condensed}>
        {list.length > 0 && list}
        {list.length === 0 && !isLoading && (
          <StyledNoResult>Aucun résultat</StyledNoResult>
        )}
      </StyledCardList>
      {isLoading && (
        <StyledCardListSpinnerContainer>
          <Spinner />
        </StyledCardListSpinnerContainer>
      )}
    </StyledCardListContainer>
  );
}
