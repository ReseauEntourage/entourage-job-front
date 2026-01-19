import { StyledSkeltonLoader } from './Skelton.styles';

export interface SkeltonProps {
  width?: string;
  height?: string;
  count?: number;
  gap?: string;
}

export const Skelton = ({
  width = '100%',
  height,
  count = 1,
}: SkeltonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, key) => (
        <StyledSkeltonLoader key={key} width={width} height={height} />
      ))}
    </>
  );
};
