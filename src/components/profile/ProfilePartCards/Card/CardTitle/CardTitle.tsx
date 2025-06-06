import React, { ReactNode, useMemo } from 'react';
import { Text } from 'src/components/utils';
import { IconName, LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { StyledCardTitle, StyledIconContainer } from './CardTitle.styles';

export interface CardTitleProps {
  title: ReactNode;
  isCompleted?: boolean;
  isEditable?: boolean;
  iaGenerated?: boolean;
}

export const CardTitle = ({
  title,
  isCompleted,
  isEditable = false,
  iaGenerated = false,
}: CardTitleProps) => {
  const iconProps = useMemo(() => {
    return {
      name: (isCompleted ? 'Check' : 'X') as IconName,
      size: 14,
      color: 'white',
    };
  }, [isCompleted]);

  const iconWithContainer = useMemo(() => {
    const icon = <LucidIcon {...iconProps} />;
    return (
      <StyledIconContainer isCompleted={isCompleted}>
        {icon}
      </StyledIconContainer>
    );
  }, [iconProps, isCompleted]);

  return (
    <StyledCardTitle>
      {isEditable && isCompleted !== undefined && iconWithContainer} {title}{' '}
      {isEditable && iaGenerated && (
        <>
          <LucidIcon name="WandSparkles" /> <Text>Généré par l&apos;IA</Text>
        </>
      )}
    </StyledCardTitle>
  );
};
