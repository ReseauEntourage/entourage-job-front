import styled, { css } from 'styled-components';
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
  font-family: Poppins, Arial, sans-serif !important;
  min-width: 300px;
  max-width: 100%;
  background-color: ${COLORS.white};
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 30px;
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
