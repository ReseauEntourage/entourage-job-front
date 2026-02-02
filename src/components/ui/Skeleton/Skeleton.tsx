import { StyledSkeletonLoader } from './Skeleton.styles';

export interface SkeletonProps {
  width?: string;
  height?: string;
  count?: number;
}

export const Skeleton = ({
  width = '100%',
  height,
  count = 1,
}: SkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, key) => (
        <StyledSkeletonLoader key={key} width={width} height={height} />
      ))}
    </>
  );
};
