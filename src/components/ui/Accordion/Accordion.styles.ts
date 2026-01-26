import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';
import { AccordionVariant } from './Accordion';

export const AccordionVariantStyles = {
  simple: {
    padding: '35px 0',
    gap: '20px',
  },
  default: {
    backgroundColor: COLORS.white,
    border: `1px solid ${COLORS.gray}`,
    borderRadius: '8px',
  },
};

export const AccordionHeaderVariantStyles = {
  simple: {},
  default: {
    padding: '20px',
  },
};

export const AccordionHeaderOpenIconVariantStyles = {
  simple: {},
  default: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
  },
};

export const AccordionContentVariantStyles = {
  simple: {},
  default: {
    borderTop: `1px solid ${COLORS.gray}`,
    padding: '20px 20px',
  },
};

export const StyledAccordion = styled.div<{ $variant: AccordionVariant }>`
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${COLORS.hoverBlue};
  border-radius: 4px;
  margin-bottom: 10px;
  width: 100%;

  ${({ $variant }) => AccordionVariantStyles[$variant]};
`;

export const StyledAccordionHeader = styled.div<{
  $isOpen: boolean;
  $variant: AccordionVariant;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  ${({ $variant }) => AccordionHeaderVariantStyles[$variant]};
`;

export const StyledAccordionHeaderContent = styled.div`
  flex: 1;
`;

export const StyledAccordionOpenIcon = styled.div<{
  $isOpen: boolean;
  $variant: AccordionVariant;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid ${COLORS.hoverBlue};
  drop-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  ${({ $variant }) => AccordionHeaderOpenIconVariantStyles[$variant]};
`;

export const StyledAccordionContent = styled.div<{
  $variant: AccordionVariant;
}>`
  ${({ $variant }) => AccordionContentVariantStyles[$variant]};
`;
