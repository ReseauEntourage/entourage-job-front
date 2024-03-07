import React, { useEffect, useState } from 'react';
import ChevronDownIcon from 'assets/icons/chevron-down.svg';
import ChevronUpIcon from 'assets/icons/chevron-up.svg';
import EditIcon from 'assets/icons/editIcon.svg';
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
  onClick?: () => void;
  editCallback?: () => void;
  isLoading?: boolean;
  isMobileClosable?: boolean;
  isDefaultOpen?: boolean;
  editButtonText?: string;
  dataTestId?: string;
  editIcon?: React.ReactNode;
}

export const Card = ({
  title,
  onClick,
  children,
  editCallback,
  isLoading = false,
  isMobileClosable = false,
  isDefaultOpen = true,
  editButtonText,
  dataTestId,
  editIcon,
}: CardProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(isDefaultOpen);

  const isDesktop = useIsDesktop();

  const [closedMode, setClosedMode] = useState<boolean>(false);
  useEffect(() => {
    setClosedMode(!isDesktop && isMobileClosable && !isOpen);
  }, [isDesktop, isMobileClosable, isOpen]);

  return (
    <StyledCard className={isDesktop ? '' : 'mobile'} onClick={onClick}>
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
                  icon={editIcon ? editIcon : <EditIcon />}
                  onClick={editCallback}
                  dataTestId={`${dataTestId}-button-edit`}
                />
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
            <StyledCardTitleContainer
              className={!closedMode ? '' : 'no-border'}
              onClick={() => {
                if (!isDesktop && isMobileClosable) setIsOpen(!isOpen);
              }}
            >
              <H5 title={title} />
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
