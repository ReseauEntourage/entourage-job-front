import React, { useEffect, useState } from 'react';
import { Button } from 'src/components/ui';
import { Spinner } from 'src/components/ui/Spinner/Spinner';
import { FilterConstant } from 'src/constants/utils';
import { loadBusinessSectorsOptions } from 'src/features/forms/utils/loadOptions.utils';
import { UserProfileSectorOccupation } from 'src/api/types';
import { formatCareerPathSentence } from 'src/utils/Formatting';
import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';
import Select from 'react-select';

const StyledRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;

  > * {
    flex: 1;
  }
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${COLORS.black};
  margin-bottom: 4px;
`;

const StyledTextInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid ${COLORS.gray};
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${COLORS.primaryBlue};
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
  const [rows, setRows] = useState<[SectorOccupationRow, SectorOccupationRow]>([
    { ...EMPTY_ROW },
    { ...EMPTY_ROW },
  ]);
  const [sectorOptions, setSectorOptions] = useState<FilterConstant<string>[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    loadBusinessSectorsOptions((options) => {
      setSectorOptions(options as FilterConstant<string>[]);
      setLoadingOptions(false);
    });
  }, []);

  useEffect(() => {
    if (initialSectorOccupations.length > 0) {
      setRows([
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
      ]);
    }
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

  const isValid = rows[0].businessSectorId !== null || rows[0].occupationName.trim() !== '';

  const handleSubmit = () => {
    const careerPathValues = {
      businessSectorId0: rows[0].businessSectorId,
      occupation0: rows[0].occupationName,
      businessSectorId1: rows[1].businessSectorId,
      occupation1: rows[1].occupationName,
    };
    onNext(formatCareerPathSentence(careerPathValues));
  };

  if (loadingOptions) {
    return <Spinner />;
  }

  return (
    <div>
      <h2>Vos métiers et secteurs recherchés</h2>
      <p>
        Indiquez dans quels domaines vous recherchez de l'aide ou souhaitez
        contribuer.
      </p>

      {([0, 1] as const).map((i) => (
        <StyledRow key={i}>
          <div>
            <StyledLabel htmlFor={`sector-${i}`}>
              Secteur {i === 0 ? '1*' : '2'}{' '}
            </StyledLabel>
            <Select
              inputId={`sector-${i}`}
              placeholder={i === 0 ? 'Secteur 1*' : 'Secteur 2 (optionnel)'}
              options={sectorOptions}
              value={rows[i].businessSectorId}
              onChange={(v) => updateRow(i, 'businessSectorId', v)}
              isClearable
            />
          </div>
          <div>
            <StyledLabel htmlFor={`occupation-${i}`}>
              Métier {i === 0 ? '1' : '2'}
            </StyledLabel>
            <StyledTextInput
              id={`occupation-${i}`}
              type="text"
              placeholder={i === 0 ? 'Métier 1' : 'Métier 2 (optionnel)'}
              value={rows[i].occupationName}
              maxLength={50}
              onChange={(e) => updateRow(i, 'occupationName', e.target.value)}
            />
          </div>
        </StyledRow>
      ))}

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <Button onClick={onBack} variant="secondary">
          Retour
        </Button>
        <Button onClick={handleSubmit} disabled={!isValid}>
          Continuer
        </Button>
      </div>
    </div>
  );
};
