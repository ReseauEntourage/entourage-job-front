import React, { useEffect, useState } from 'react';
import ChevronDownIcon from 'assets/icons/chevron-down.svg';
import ChevronUpIcon from 'assets/icons/chevron-up.svg';
import EditIcon from 'assets/icons/editIcon.svg';
import { Button } from '../Button';
import { ButtonIcon } from '../ButtonIcon';
import { H5 } from 'src/components/utils/Headings';
import { Spinner } from 'src/components/utils/Spinner';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledCard,
  StyledCardTitleContainer,
  StyledEditIconContainer,
  StyledSpinnerContainer,
  StyledChevronContainer,
  StyledCardFooter,
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
  isMobileClosable?: boolean;
  isDefaultOpen?: boolean;
  EditButtonText?: string;
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
  isMobileClosable = false,
  isDefaultOpen = true,
  EditButtonText,
}: CardProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(isDefaultOpen);

  const isDesktop = useIsDesktop();

  const [closedMode, setClosedMode] = useState<boolean>(false);
  useEffect(() => {
    setClosedMode(!isDesktop && isMobileClosable && !isOpen);
  }, [isDesktop, isMobileClosable, isOpen]);

  return (
    <StyledCard className={isDesktop ? '' : 'mobile'}>
      {isLoading && (
        <StyledSpinnerContainer>
          <Spinner />
        </StyledSpinnerContainer>
      )}
      {!isLoading && editCallback && isDesktop && (
        <StyledEditIconContainer>
          <ButtonIcon icon={<EditIcon />} onClick={editCallback} />
        </StyledEditIconContainer>
      )}
      {isMobileClosable && !isDesktop && (
        <StyledChevronContainer>
          <ButtonIcon
            icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          />
        </StyledChevronContainer>
      )}
      {title && (
        <StyledCardTitleContainer
          className={!closedMode ? '' : 'no-border'}
          onClick={() => {
            if (!isDesktop && isMobileClosable) setIsOpen(!isOpen);
          }}
        >
          <H5 title={title} />
        </StyledCardTitleContainer>
      )}
      {!closedMode && children}
      {!closedMode && !isLoading && editCallback && !isDesktop && (
        <StyledCardFooter>
          <Button style="custom-secondary" onClick={editCallback}>
            {EditButtonText || 'Modifier'}
          </Button>
        </StyledCardFooter>
      )}
    </StyledCard>
  );
};
