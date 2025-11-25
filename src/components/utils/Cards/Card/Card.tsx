import React, { useState } from 'react';
import { Color } from '@/src/constants/styles';
import { LucidIcon } from '../../Icons/LucidIcon';
import { Text } from '../../Text';
import { Button, ButtonIcon } from 'src/components/utils/Button';
import { H5 } from 'src/components/utils/Headings';
import { Spinner } from 'src/components/utils/Spinner';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledCard,
  StyledCardContent,
  StyledCardFooter,
  StyledCardTitleContainer,
  StyledCardTopContainer,
  StyledChevronContainer,
  StyledEditIconContainer,
  StyledSpinnerContainer,
} from './Card.styles';

interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: string;
  centerTitle?: boolean;
  onClick?: () => void;
  editCallback?: () => void;
  isLoading?: boolean;
  isMobileClosable?: boolean;
  isDesktopClosable?: boolean;
  isDefaultOpen?: boolean;
  editButtonText?: string;
  dataTestId?: string;
  editIcon?: React.ReactNode;
  borderColor?: string;
  bgColor?: Color;
}

export const Card = ({
  title,
  subtitle,
  onClick,
  children,
  editCallback,
  isLoading = false,
  isMobileClosable = false,
  isDesktopClosable = false,
  isDefaultOpen = true,
  editButtonText,
  dataTestId,
  editIcon,
  borderColor,
  centerTitle = false,
  bgColor = 'white',
}: CardProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(isDefaultOpen);

  const isDesktop = useIsDesktop();
  const isClosable =
    (isDesktop && isDesktopClosable) || (!isDesktop && isMobileClosable);

  return (
    <StyledCard
      className={isDesktop ? '' : 'mobile'}
      onClick={onClick}
      data-testid={dataTestId}
      borderColor={borderColor}
      bgColor={bgColor}
    >
      {title ? (
        <>
          <StyledCardTopContainer isOpen={isOpen}>
            {isLoading && (
              <StyledSpinnerContainer>
                <Spinner />
              </StyledSpinnerContainer>
            )}
            <StyledCardTitleContainer
              onClick={() => {
                if (isClosable) setIsOpen(!isOpen);
              }}
              centerTitle={centerTitle}
            >
              <H5 title={title} center={centerTitle} />
              {subtitle && <Text center={centerTitle}>{subtitle}</Text>}
              {!isLoading && editCallback && isDesktop && (
                <StyledEditIconContainer>
                  <ButtonIcon
                    icon={editIcon || <LucidIcon name="Pencil" size={15} />}
                    onClick={editCallback}
                    dataTestId={`${dataTestId}-button-edit`}
                  />
                </StyledEditIconContainer>
              )}
            </StyledCardTitleContainer>
            {isClosable && (
              <StyledChevronContainer>
                <ButtonIcon
                  icon={
                    isOpen ? (
                      <LucidIcon name="ChevronUp" color="black" />
                    ) : (
                      <LucidIcon name="ChevronDown" color="black" />
                    )
                  }
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                />
              </StyledChevronContainer>
            )}
          </StyledCardTopContainer>
          {isOpen && (
            <StyledCardContent>
              {children}
              {!isLoading && editCallback && !isDesktop && (
                <StyledCardFooter>
                  <Button variant="secondary" rounded onClick={editCallback}>
                    {editButtonText || 'Modifier'}
                  </Button>
                </StyledCardFooter>
              )}
            </StyledCardContent>
          )}
        </>
      ) : (
        children
      )}
    </StyledCard>
  );
};
