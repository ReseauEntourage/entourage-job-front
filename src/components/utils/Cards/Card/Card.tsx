import React, { useEffect, useState } from 'react';
import { LucidIcon } from '../../Icons/LucidIcon';
import { Text } from '../../Text';
import { Button } from 'src/components/utils/Button';
import { ButtonIcon } from 'src/components/utils/ButtonIcon';
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
  centerTitle = false,
}: CardProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(isDefaultOpen);

  const isDesktop = useIsDesktop();
  const isClosable =
    (isDesktop && isDesktopClosable) || (!isDesktop && isMobileClosable);

  const [closedMode, setClosedMode] = useState<boolean>(false);
  useEffect(() => {
    setClosedMode(isClosable && !isOpen);
  }, [isClosable, isOpen]);

  return (
    <StyledCard
      className={isDesktop ? '' : 'mobile'}
      onClick={onClick}
      data-testid={dataTestId}
    >
      {title ? (
        <>
          <StyledCardTopContainer>
            {isLoading && (
              <StyledSpinnerContainer>
                <Spinner />
              </StyledSpinnerContainer>
            )}
            {!isLoading && editCallback && isDesktop && (
              <StyledEditIconContainer>
                <ButtonIcon
                  icon={editIcon || <LucidIcon name="Pencil" size={15} />}
                  onClick={editCallback}
                  dataTestId={`${dataTestId}-button-edit`}
                />
              </StyledEditIconContainer>
            )}
            {isClosable && (
              <StyledChevronContainer>
                <ButtonIcon
                  icon={
                    isOpen ? (
                      <LucidIcon name="ChevronUp" />
                    ) : (
                      <LucidIcon name="ChevronDown" />
                    )
                  }
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                />
              </StyledChevronContainer>
            )}
            <StyledCardTitleContainer
              className={!closedMode ? '' : 'no-border'}
              onClick={() => {
                if (isClosable) setIsOpen(!isOpen);
              }}
              centerTitle={centerTitle}
            >
              <H5 title={title} center={centerTitle} />
              {subtitle && <Text center={centerTitle}>{subtitle}</Text>}
            </StyledCardTitleContainer>
          </StyledCardTopContainer>
          {!closedMode && (
            <StyledCardContent>
              {children}
              {!closedMode && !isLoading && editCallback && !isDesktop && (
                <StyledCardFooter>
                  <Button style="custom-secondary" onClick={editCallback}>
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
