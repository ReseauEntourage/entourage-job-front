import { StyledSkeletonLoader } from './Skeleton.styles';

interface SkeletonProps {
  width?: string;
  height?: string;
  count?: number;
  inverted?: boolean;
}

export const Skeleton = ({
  width = '100%',
  height,
  count = 1,
  inverted = false,
}: SkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, key) => (
        <StyledSkeletonLoader
          key={key}
          width={width}
          height={height}
          inverted={inverted}
        />
      ))}
    </>
  );
};
