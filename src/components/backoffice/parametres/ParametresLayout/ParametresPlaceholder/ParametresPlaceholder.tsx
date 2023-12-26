import React from 'react';
import { Button } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { StyledParametresCardPlaceholder } from './ParametresPlaceholder.styles';

interface ParametresPlaceholderProps {
  onClick: () => void;
  image: React.ReactNode;
  title: string;
  description: string;
}

export const ParametresPlaceholder = ({
  onClick,
  image,
  title,
  description,
}: ParametresPlaceholderProps) => {
  return (
    <StyledParametresCardPlaceholder>
      <div>
        <div className="illu-container">{image}</div>
        <div className="text-container">
          <H6 title={title} color="black" />
          <p>{description}</p>
        </div>
      </div>
      <Button style="custom-secondary" onClick={onClick}>
        Renseigner
      </Button>
    </StyledParametresCardPlaceholder>
  );
};
