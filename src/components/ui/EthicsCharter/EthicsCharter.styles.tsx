import { styled } from 'styled-components';
import { EthicsCharterVariant } from './EthicsCharter.types';

export const EthicsCharterContainer = styled.div<{
  $variant: EthicsCharterVariant;
}>`
  display: flex;
  flex-direction: column;
  gap: ${({ $variant }) => ($variant === 'page' ? '40px' : '30px')};
  ${({ $variant }) =>
    $variant === 'page' &&
    `
    max-width: 620px;
    margin-left: auto;
    margin-right: auto;
  `}
  ${({ $variant }) =>
    $variant === 'compact' &&
    `
    max-height: 45vh;
    overflow-y: auto;
    padding-right: 10px;
  `}
`;

export const EthicsCharterItem = styled.div<{
  $variant: EthicsCharterVariant;
}>`
  display: flex;
  flex-direction: column;
  gap: ${({ $variant }) => ($variant === 'page' ? '10px' : '5px')};
  ${({ $variant }) =>
    $variant === 'page' &&
    `
    p {
      margin: 0;
      text-align: justify;
    }
  `}
`;
