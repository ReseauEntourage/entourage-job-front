import styled, { css } from 'styled-components';
import { FieldErrorMessage } from '../../forms/fields/FieldErrorMessage/FieldErrorMessage';
import { StyledErrorMessage } from '../../forms/fields/FieldErrorMessage/FieldErrorMessage.styles';
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
  background-color: ${COLORS.white};
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 30px;
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
  margin-bottom: 30px;
`;

export const StyledInputLabel = styled.label`
  padding: 4px 0;
  font-size: 14px;
  line-height: 17px;
  height: 25px;
  box-sizing: border-box;
  font-family: Poppins, sans-serif;
  display: inline-block;
`;

export const StyledAnnotations = styled.div`
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 12px;
  width: 100%;
  align-items: center;
`;

export const StyledAnnotationsErrorMessage = styled(FieldErrorMessage)`
  position: relative !important;
  bottom: 0 !important;
`;

export const StyledLimit = styled.div`
  color: ${({ warning }) => {
    return warning ? COLORS.noRed : COLORS.darkGray;
  }};
  font-size: 12px;
  line-height: 12px;
  text-align: right;
  align-self: flex-end;
`;
