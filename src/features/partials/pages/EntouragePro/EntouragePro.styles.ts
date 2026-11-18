import { styled } from 'styled-components';
import { COLORS, SHADOWS } from '@/src/constants/styles';
import { marginLargeBottom } from '@/src/styles/margins';

/** Centered column of the innovations section. */
export const StyledInnovationsContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const StyledInnovationsTitle = styled.h2`
  display: block;
  font-weight: 700;
  margin-left: auto;
  margin-right: auto;
  text-align: center !important;
  margin-top: 0 !important;
  ${marginLargeBottom}
`;

/** Numbered card of the innovations: white text on the primary color. */
export const StyledInnovationCard = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  padding: 20px;
  overflow: hidden;
  border-radius: 5px;
  background: ${COLORS.primaryBlue};
  color: ${COLORS.white};
  box-shadow: ${SHADOWS.block};
  transition: box-shadow 0.1s ease-in-out;

  > :last-child {
    margin-bottom: 0;
  }
`;

export const StyledInnovationNumber = styled.div`
  margin-right: 10px !important;
  font-size: 46px;
  font-weight: 700;
  line-height: 1;
  color: ${COLORS.white} !important;
`;

export const StyledInnovationText = styled.div`
  margin-left: 10px !important;
  color: ${COLORS.white} !important;
`;
