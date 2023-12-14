import React from 'react';
import EditIcon from 'assets/icons/editIcon.svg';
import { ButtonIcon } from '../ButtonIcon';
import { H5 } from 'src/components/utils/Headings';
import { Spinner } from 'src/components/utils/Spinner';
import {
  StyledCard,
  StyledCardTitleContainer,
  StyledEditIconContainer,
  StyledSpinnerContainer,
} from './Card.styles';

interface CardProps {
  children: React.ReactNode;
  // badge?: React.ReactNode;
  // style?: 'default' | 'primary' | 'secondary';
  title?: React.ReactNode;
  // body?: boolean;
  // hover?: boolean;
  // size?: 'small' | 'large' | 'default';
  editCallback?: () => void;
  isLoading?: boolean;
}

export const Card = ({
  title,
  // style = 'default',
  // body = true,
  // hover = false,
  // size,
  children,
  editCallback,
  isLoading = false,
}: CardProps) => {
  return (
    <StyledCard>
      {isLoading && (
        <StyledSpinnerContainer>
          <Spinner />
        </StyledSpinnerContainer>
      )}
      {!isLoading && editCallback && (
        <StyledEditIconContainer>
          <ButtonIcon icon={<EditIcon />} onClick={editCallback} />
        </StyledEditIconContainer>
      )}
      {title && (
        <StyledCardTitleContainer>
          <H5 title={title} />
        </StyledCardTitleContainer>
      )}
      {children}
    </StyledCard>
  );
};
