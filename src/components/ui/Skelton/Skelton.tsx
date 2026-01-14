import { StyledSkeltonContainer, StyledSkeltonLoader } from './Skelton.styles';

export interface SkeltonProps {
  width?: string;
  height?: string;
  count?: number;
  gap?: string;
}

export const Skelton = ({
  width,
  height,
  count = 1,
  gap = '12px',
}: SkeltonProps) => {
  return (
    <StyledSkeltonContainer style={{ gap }}>
      {Array.from({ length: count }).map((_, key) => (
        <StyledSkeltonLoader key={key} width={width} height={height} />
      ))}
    </StyledSkeltonContainer>
  );
};
