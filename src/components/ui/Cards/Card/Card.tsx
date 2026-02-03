import React, { useState } from 'react';
import { ButtonIcon } from '@/src/components/ui/Button';
import { H5 } from '@/src/components/ui/Headings';
import { Spinner } from '@/src/components/ui/Spinner';
import { Color } from '@/src/constants/styles';
import { LucidIcon } from '../../Icons/LucidIcon';
import { Text } from '../../Text';
import { useIsDesktop } from 'src/hooks/utils';
import {
  StyledCard,
  StyledCardContent,
  StyledCardTitleContainer,
  StyledCardTopContainer,
  StyledChevronContainer,
  StyledSpinnerContainer,
} from './Card.styles';

interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: string;
  centerTitle?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
  isMobileClosable?: boolean;
  isDesktopClosable?: boolean;
  isDefaultOpen?: boolean;
  editButtonText?: string;
  dataTestId?: string;
  borderColor?: string;
  bgColor?: Color;
  shadow?: boolean;
}

export const Card = ({
  title,
  subtitle,
  onClick,
  children,
  isLoading = false,
  isMobileClosable = false,
  isDesktopClosable = false,
  isDefaultOpen = true,
  dataTestId,
  borderColor,
  centerTitle = false,
  bgColor = 'white',
  shadow = true,
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
      $borderColor={borderColor}
      $bgColor={bgColor}
      $shadow={shadow}
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
                if (isClosable) {
                  setIsOpen(!isOpen);
                }
              }}
              centerTitle={centerTitle}
            >
              <H5 title={title} center={centerTitle} />
              {subtitle && <Text center={centerTitle}>{subtitle}</Text>}
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
          {isOpen && <StyledCardContent>{children}</StyledCardContent>}
        </>
      ) : (
        children
      )}
    </StyledCard>
  );
};
