import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
`;

export const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StyledLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
`;

export const StyledLoadingMessage = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

export const StyledProfileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledSkeletonCard = styled.div`
  height: 100px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.06) 25%,
    rgba(255, 255, 255, 0.16) 50%,
    rgba(255, 255, 255, 0.06) 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.8s ease-in-out infinite;
`;
