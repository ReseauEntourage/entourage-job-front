import styled, { css } from 'styled-components';
import { LINE_HEIGHT_MULTIPLIER, sizesPx } from '../Text/Text.utils';
import { COLORS } from 'src/constants/styles';
import { FieldErrorMessage } from 'src/features/forms/fields/FieldErrorMessage/FieldErrorMessage';

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
  margin-bottom: 16px;
`;
export const commonInputStyles = css`
  font-family: Poppins, sans-serif;
  font-size: ${sizesPx.desktop.normal}px;
  width: 100%;
  background-color: transparent;
  border: 1px solid ${COLORS.gray};
  color: ${COLORS.black};
  border-radius: 8px;
  text-align: left;
  padding: 12px 16px;
  font-size: 14px;
  line-height: ${LINE_HEIGHT_MULTIPLIER * sizesPx.desktop.normal}px;
  min-height: 30px;
  box-sizing: border-box;

  :focus {
    outline: none;
    border: 1px solid ${COLORS.primaryBlue};
  }

  :hover {
    border: 1px solid ${COLORS.darkGray};
  }
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
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
  align-items: flex-start;
`;

export const StyledAnnotationsErrorMessage = styled(FieldErrorMessage)`
  position: relative !important;
  bottom: 0 !important;
  margin-right: auto;
`;

export const StyledLimitContainer = styled.div`
  display: flex;
  > :first-child {
    margin-right: 5px;
  }
`;

export const StyledLimit = styled.div`
  text-align: right;
  align-self: flex-end;
  min-height: 30px;
  display: flex;
  padding-top: 5px;
`;
