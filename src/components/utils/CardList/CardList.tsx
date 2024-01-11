import React from 'react';
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
}

export function CardList({
  list,
  isLoading = false,
  dataTestId,
}: CardListProps) {
  return (
    <StyledCardListContainer>
      <StyledCardList
        data-uk-scrollspy="cls:uk-animation-slide-bottom-small; target: li;"
        data-testid={dataTestId}
      >
        {list}
      </StyledCardList>
      {isLoading && (
        <StyledCardListSpinnerContainer>
          <Spinner />
        </StyledCardListSpinnerContainer>
      )}
    </StyledCardListContainer>
  );
}
