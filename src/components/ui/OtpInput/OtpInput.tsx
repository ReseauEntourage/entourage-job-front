import React, { useCallback, useRef } from 'react';
import { StyledOtpContainer, StyledOtpField } from './OtpInput.styles';

const OTP_LENGTH = 6;

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}

export const OtpInput = ({
  value,
  onChange,
  hasError = false,
  disabled = false,
}: OtpInputProps) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] ?? '');

  const focusIndex = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(OTP_LENGTH - 1, index));
    inputsRef.current[clamped]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, raw: string) => {
      const digit = raw.replace(/\D/g, '').slice(-1);
      const next = digits.slice();
      next[index] = digit;
      onChange(next.join(''));
      if (digit && index < OTP_LENGTH - 1) {
        focusIndex(index + 1);
      }
    },
    [digits, onChange, focusIndex]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (digits[index]) {
          const next = digits.slice();
          next[index] = '';
          onChange(next.join(''));
        } else if (index > 0) {
          const next = digits.slice();
          next[index - 1] = '';
          onChange(next.join(''));
          focusIndex(index - 1);
        }
      } else if (e.key === 'ArrowLeft') {
        focusIndex(index - 1);
      } else if (e.key === 'ArrowRight') {
        focusIndex(index + 1);
      }
    },
    [digits, onChange, focusIndex]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, OTP_LENGTH);
      if (!pasted) return;
      const next = Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] ?? '');
      onChange(next.join(''));
      focusIndex(Math.min(pasted.length, OTP_LENGTH - 1));
    },
    [onChange, focusIndex]
  );

  return (
    <StyledOtpContainer>
      {digits.map((digit, i) => (
        <StyledOtpField
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          hasError={hasError}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          aria-label={`Chiffre ${i + 1} du code`}
        />
      ))}
    </StyledOtpContainer>
  );
};
