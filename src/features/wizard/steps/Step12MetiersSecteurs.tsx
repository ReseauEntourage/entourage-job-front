import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { UserProfileSectorOccupation } from 'src/api/types';
import { Button, Text } from 'src/components/ui';
import { H2 } from 'src/components/ui/Headings';
import { Select, TextInput } from 'src/components/ui/Inputs';
import { Spinner } from 'src/components/ui/Spinner/Spinner';
import { FilterConstant } from 'src/constants/utils';
import {
  StyledOnboardingActions,
  StyledOnboardingStepContainer,
} from 'src/features/backoffice/onboarding/onboarding.styles';
import { loadBusinessSectorsOptions } from 'src/features/forms/utils/loadOptions.utils';
import { formatCareerPathSentence } from 'src/utils/Formatting';

const StyledRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;

  > * {
    flex: 1;
  }
`;

interface SectorOccupationRow {
  businessSectorId: FilterConstant<string> | null;
  occupationName: string;
}

const EMPTY_ROW: SectorOccupationRow = {
  businessSectorId: null,
  occupationName: '',
};

interface Step12MetiersSecteursProps {
  initialSectorOccupations?: UserProfileSectorOccupation[];
  onNext: (sectorOccupations: UserProfileSectorOccupation[]) => void;
  onBack: () => void;
}

export const Step12MetiersSecteurs = ({
  initialSectorOccupations = [],
  onNext,
  onBack,
}: Step12MetiersSecteursProps) => {
  const [rows, setRows] = useState<[SectorOccupationRow, SectorOccupationRow]>(
    () => {
      if (initialSectorOccupations.length > 0) {
        return [
          {
            businessSectorId: initialSectorOccupations[0]?.businessSector?.id
              ? {
                  value: initialSectorOccupations[0].businessSector.id,
                  label: initialSectorOccupations[0].businessSector.name ?? '',
                }
              : null,
            occupationName: initialSectorOccupations[0]?.occupation?.name ?? '',
          },
          {
            businessSectorId: initialSectorOccupations[1]?.businessSector?.id
              ? {
                  value: initialSectorOccupations[1].businessSector.id,
                  label: initialSectorOccupations[1].businessSector.name ?? '',
                }
              : null,
            occupationName: initialSectorOccupations[1]?.occupation?.name ?? '',
          },
        ];
      }
      return [{ ...EMPTY_ROW }, { ...EMPTY_ROW }];
    }
  );
  const [sectorOptions, setSectorOptions] = useState<FilterConstant<string>[]>(
    []
  );
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    loadBusinessSectorsOptions((options) => {
      setSectorOptions(options as FilterConstant<string>[]);
      setLoadingOptions(false);
    });
  }, []);

  const updateRow = (
    index: 0 | 1,
    field: keyof SectorOccupationRow,
    value: SectorOccupationRow[keyof SectorOccupationRow]
  ) => {
    setRows((prev) => {
      const next: [SectorOccupationRow, SectorOccupationRow] = [
        { ...prev[0] },
        { ...prev[1] },
      ];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const isValid =
    rows[0].businessSectorId !== null || rows[0].occupationName.trim() !== '';

  const handleSubmit = () => {
    const careerPathValues = {
      businessSectorId0: rows[0].businessSectorId ?? undefined,
      occupation0: rows[0].occupationName,
      businessSectorId1: rows[1].businessSectorId ?? undefined,
      occupation1: rows[1].occupationName,
    };
    onNext(formatCareerPathSentence(careerPathValues));
  };

  if (loadingOptions) {
    return <Spinner />;
  }

  return (
    <StyledOnboardingStepContainer>
      <H2 title="Vos métiers et secteurs recherchés" />
      <Text>
        Indiquez dans quels domaines vous recherchez de l'aide ou souhaitez
        contribuer.
      </Text>

      {([0, 1] as const).map((i) => (
        <StyledRow key={i}>
          <Select
            id={`sector-${i}`}
            name={`sector-${i}`}
            title={i === 0 ? 'Secteur 1*' : 'Secteur 2'}
            placeholder={i === 0 ? 'Secteur 1*' : 'Secteur 2 (optionnel)'}
            options={sectorOptions}
            value={rows[i].businessSectorId as FilterConstant}
            onChange={(v) =>
              updateRow(
                i,
                'businessSectorId',
                v as FilterConstant<string> | null
              )
            }
            showLabel
          />
          <TextInput
            id={`occupation-${i}`}
            name={`occupation-${i}`}
            title={i === 0 ? 'Métier 1' : 'Métier 2'}
            placeholder={i === 0 ? 'Métier 1' : 'Métier 2 (optionnel)'}
            value={rows[i].occupationName}
            onChange={(value) => updateRow(i, 'occupationName', value)}
            maxLength={50}
            showLabel
          />
        </StyledRow>
      ))}

      <StyledOnboardingActions>
        <Button onClick={onBack} size="large" variant="secondary">
          Retour
        </Button>
        <Button onClick={handleSubmit} disabled={!isValid} size="large">
          Étape suivante
        </Button>
      </StyledOnboardingActions>
    </StyledOnboardingStepContainer>
  );
};
