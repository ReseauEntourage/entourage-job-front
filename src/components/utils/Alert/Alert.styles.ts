import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';
import { AlertVariant } from './Alert.types';

export const StyledAlert = styled.div<{ variant: AlertVariant }>`
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  padding: 10px 20px;
  background-color: ${(props) => {
    return COLORS.alert[props.variant]?.background || COLORS.white;
  }};
  color: ${(props) => {
    return COLORS.alert[props.variant]?.text || COLORS.white;
  }};
  font-weight: 700;
  color: ${COLORS.alert.info.text};
  .icon {
    width: 46px;
    height: 46px;
  }
  p {
    margin: 0;
  }
`;
