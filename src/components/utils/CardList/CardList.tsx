import React, { type JSX } from 'react';
import { Spinner } from '../Spinner';
import { StyledNoResult } from 'src/components/backoffice/Backoffice.styles';
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
