import React, { useCallback, useState } from 'react';
import { LucidIcon } from '../Icons';
import { COLORS } from 'src/constants/styles';
import {
  StyledCopyButton,
  StyledInput,
  StyledWrapper,
} from './CopyInput.styles';

interface CopyInputProps {
  value: string;
  label?: string;
}

export const CopyInput = ({ value, label }: CopyInputProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <div>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 13,
            marginBottom: 6,
            fontFamily: 'Poppins, sans-serif',
            color: COLORS.darkGray,
          }}
        >
          {label}
        </label>
      )}
      <StyledWrapper>
        <StyledInput
          type="text"
          value={value}
          readOnly
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <StyledCopyButton
          type="button"
          $copied={copied}
          onClick={handleCopy}
          aria-label="Copier le lien"
        >
          {!copied && <LucidIcon name="Copy" size={14} color={COLORS.black} />}
          {copied ? 'Copié !' : 'Copier'}
        </StyledCopyButton>
      </StyledWrapper>
    </div>
  );
};
