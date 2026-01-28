import React, { useEffect, useMemo, useState } from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { LucidIcon, Text } from '@/src/components/ui';
import { Accordion } from '@/src/components/ui/Accordion/Accordion';
import { H4 } from '@/src/components/ui/Headings';
import { SelectAsync, TextInput } from '@/src/components/ui/Inputs';
import { COLORS } from '@/src/constants/styles';
import { loadBusinessSectorsOptions } from '@/src/features/forms/utils/loadOptions.utils';
import {
  StyledAccordionHeader,
  StyledAccordionHeaderIcon,
  StyledAccordionHeaderTitleContainer,
} from '../Content.styles';
import { ProfileCompletionFormValues } from '../types';

const StyledTwoColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ProfessionalInfoAccordionCandidate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    control,
    getValues,
    formState: { errors, submitCount },
  } = useFormContext<ProfileCompletionFormValues>();

  useEffect(() => {
    if (
      submitCount > 0 &&
      (!!errors.businessSectorId0 ||
        !!errors.occupation0 ||
        !!errors.businessSectorId1 ||
        !!errors.occupation1)
    ) {
      setIsOpen(true);
    }
  }, [
    errors.businessSectorId0,
    errors.occupation0,
    errors.businessSectorId1,
    errors.occupation1,
    submitCount,
  ]);

  const rows = useMemo(() => {
    return [
      {
        index: 0,
        businessSectorIdName: 'businessSectorId0' as const,
        occupationName: 'occupation0' as const,
        sectorPlaceholder: 'Secteur 1*',
        occupationPlaceholder: 'Métier 1',
        sectorTitle: 'Secteur(s) recherché(s)',
        occupationTitle: 'Métier(s) recherché(s)',
      },
      {
        index: 1,
        businessSectorIdName: 'businessSectorId1' as const,
        occupationName: 'occupation1' as const,
        sectorPlaceholder: 'Secteur 2',
        occupationPlaceholder: 'Métier 2',
      },
    ];
  }, []);

  return (
    <Accordion
      headerContent={
        <StyledAccordionHeader>
          <StyledAccordionHeaderIcon>
            <LucidIcon name="Briefcase" color={COLORS.white} size={24} />
          </StyledAccordionHeaderIcon>
          <StyledAccordionHeaderTitleContainer>
            <H4 title="Informations professionnelles" noMarginBottom />
            <Text>Expérience et compétences</Text>
          </StyledAccordionHeaderTitleContainer>
        </StyledAccordionHeader>
      }
      keepContentMounted
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      {rows.map((row) => (
        <StyledTwoColumns key={row.index}>
          <Controller
            control={control}
            name={row.businessSectorIdName}
            rules={
              row.index === 0
                ? {
                    required: 'Obligatoire',
                  }
                : {
                    validate: (value) => {
                      const occupation1 = getValues('occupation1');
                      return !!value || !occupation1 || 'Obligatoire';
                    },
                  }
            }
            render={({ field }) => (
              <SelectAsync
                id={`onboarding-businessSectorId${row.index}`}
                name={`onboarding-businessSectorId${row.index}`}
                title={
                  row.sectorTitle ? (
                    <Text weight="semibold">{row.sectorTitle}</Text>
                  ) : undefined
                }
                value={field.value as any}
                onChange={(value) => field.onChange(value || null)}
                onBlur={field.onBlur}
                error={
                  submitCount > 0
                    ? (errors[row.businessSectorIdName] as unknown as
                        | FieldError
                        | undefined)
                    : undefined
                }
                showLabel
                placeholder={row.sectorPlaceholder}
                isMulti={false}
                openMenuOnClick
                loadOptions={(callback, inputValue) =>
                  loadBusinessSectorsOptions(callback, inputValue)
                }
              />
            )}
          />

          <Controller
            control={control}
            name={row.occupationName}
            render={({ field }) => (
              <TextInput
                id={`onboarding-occupation${row.index}`}
                name={`onboarding-occupation${row.index}`}
                title={
                  row.occupationTitle ? (
                    <Text weight="semibold">{row.occupationTitle}</Text>
                  ) : undefined
                }
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={
                  submitCount > 0
                    ? (errors[row.occupationName] as unknown as
                        | FieldError
                        | undefined)
                    : undefined
                }
                showLabel
                placeholder={row.occupationPlaceholder}
                maxLength={50}
              />
            )}
          />
        </StyledTwoColumns>
      ))}
    </Accordion>
  );
};
