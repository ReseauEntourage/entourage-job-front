import React, { useCallback, useRef } from 'react';
import { Button, LucidIcon, Text } from '@/src/components/ui';
import { COLORS } from '@/src/constants/styles';
import { OpenAILegalMention } from '@/src/features/profile/ai/OpenAILegalMention';
import {
  StyledButtonsContainer,
  StyledContainer,
  StyledDropZone,
  StyledHelpText,
} from './StepCvChoiceContent.styles';

interface StepCvChoiceContentProps {
  onCvSelected: (formData: FormData) => void;
  onManualChoice: () => void;
}

export const StepCvChoiceContent = ({
  onCvSelected,
  onManualChoice,
}: StepCvChoiceContentProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type !== 'application/pdf') {
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      onCvSelected(formData);
    },
    [onCvSelected]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
      e.target.value = '';
    },
    [handleFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  return (
    <StyledContainer>
      <StyledDropZone
        $isDragOver={isDragOver}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <LucidIcon name="FileText" size={40} color={COLORS.primaryBlue} />
        <Text weight="semibold">Importer mon CV</Text>
        <Text size="small" color="darkGray">
          Le plus rapide · je pré-remplis tout, vous vérifiez
        </Text>
      </StyledDropZone>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />

      <StyledButtonsContainer>
        <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
          Importer mon CV
        </Button>
        <Button variant="secondary" onClick={onManualChoice}>
          Le remplir moi-même
        </Button>
      </StyledButtonsContainer>

      <StyledHelpText>
        <Text size="small" color="darkGray">
          {
            'Pas de CV sous la main ? Aucun souci, « Le remplir moi-même » prend une minute.'
          }
        </Text>
      </StyledHelpText>

      <OpenAILegalMention />
    </StyledContainer>
  );
};
