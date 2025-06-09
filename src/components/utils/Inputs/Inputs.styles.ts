import styled, { css } from 'styled-components';
import { FieldErrorMessage } from 'src/components/forms/fields/FieldErrorMessage/FieldErrorMessage';
import { COLORS } from 'src/constants/styles';

export const commonMenuOptionStyles = css`
  width: 100%;
  background-color: white;
  border: 0.5px solid white;
  border-bottom: 0.5px solid #f4f3f3;
  text-align: left;
  font-size: 14px;
  line-height: 17px;
  padding: 16px 12px;
  transition: 0.2s ease-in-out;
  font-family: Poppins, sans-serif !important;
  display: flex;
  align-items: center;
`;

export const commonInputContainerStyles = css`
  font-family: Poppins, sans-serif !important;
  max-width: 100%;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  position: relative;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;
export const commonInputStyles = css`
  font-family: Poppins, sans-serif;
  width: 100%;
  background-color: transparent;
  border: 0.5px solid white;
  color: ${COLORS.black};
  border-bottom: solid 2px ${COLORS.gray};
  text-align: left;
  font-size: 14px;
  line-height: 17px;
  padding: 4px 0;
  min-height: 30px;
  box-sizing: border-box;
`;

export const StyledInputLabel = styled.label`
  padding: 4px 0;
  font-size: 14px;
  line-height: 17px;
  box-sizing: border-box;
  font-family: Poppins, sans-serif;
  display: inline-block;
`;

export const StyledInputLabelOptional = styled.span`
  color: ${COLORS.mediumGray};
  margin-left: 5px;
`;

export const StyledAnnotations = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: flex-start;
`;

export const StyledAnnotationsErrorMessage = styled(FieldErrorMessage)`
  position: relative !important;
  bottom: 0 !important;
`;

export const StyledLimitContainer = styled.div`
  display: flex;
  > :first-child {
    margin-right: 5px;
  }
`;

export const StyledLimit = styled.div`
  color: ${({ warning }) => {
    return warning ? COLORS.darkOrange : COLORS.mediumGray;
  }};
  font-size: 12px;
  line-height: 12px;
  text-align: right;
  align-self: flex-end;
  min-height: 30px;
  display: flex;
  > * {
    padding-top: 5px;
  }
`;
