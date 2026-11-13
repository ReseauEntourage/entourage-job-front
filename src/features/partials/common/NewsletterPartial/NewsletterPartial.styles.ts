import { css, styled } from 'styled-components';
import { Section } from '@/src/components/ui';
import { COLORS, BREAKPOINTS } from '@/src/constants/styles';

export const StyledNLForm = styled.div`
  display: block;
  max-width: 920px;
  margin: 0 auto;
  .form-group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-height: 70px;
    align-items: flex-start;
    margin-top: 16px;
    &:first-of-type {
      border-bottom: ${COLORS.gray} 1px solid;
    }
    &.text-input-container > div {
      width: 100%;
    }
    .group-name {
      min-width: 70px;
      margin-right: 20px;
      color: ${COLORS.primaryBlue};
      font-weight: 700;
    }
    .checkbox-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      color: ${COLORS.darkGray};
      .input-label {
        display: flex;
        flex-direction: row;
        flex: 1;
        margin-bottom: 16px;
      }
    }
    @media screen and (min-width: ${BREAKPOINTS.desktop}px) {
      align-items: center;
      .checkbox-container {
        flex-direction: row;
        .input-label {
          margin-bottom: 0;
        }
      }
    }
  }
`;

/** Newsletter section, optionally without vertical padding. */
export const StyledNewsletterSection = styled(Section)<{
  $noVerticalPadding: boolean;
}>`
  ${({ $noVerticalPadding }) =>
    $noVerticalPadding &&
    css`
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    `}
`;

/** Error message. */
export const StyledNewsletterError = styled.div<{ $center?: boolean }>`
  color: ${COLORS.danger} !important;
  ${({ $center }) =>
    $center &&
    css`
      text-align: center !important;
    `}
`;

/** Centered submit row. */
export const StyledNewsletterSubmit = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px !important;
`;
