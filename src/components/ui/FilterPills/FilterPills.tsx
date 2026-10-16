import React, { useRef } from 'react';
import { StyledFilterPill, StyledFilterPills } from './FilterPills.styles';
import { FilterPillsProps } from './FilterPills.types';

const ARROW_STEPS: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

/**
 * A single choice among a few values, as pills: a radio group where only
 * the checked pill is tabbable and the arrow keys move the choice.
 */
export function FilterPills<TValue extends string = string>({
  options,
  value,
  onChange,
  ariaLabel,
  idPrefix,
  scrollOnMobile = false,
}: FilterPillsProps<TValue>) {
  const pillsRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = ARROW_STEPS[event.key];
    if (!step) {
      return;
    }
    event.preventDefault();
    const index = options.findIndex((option) => option.value === value);
    const nextIndex = (index + step + options.length) % options.length;
    onChange(options[nextIndex].value);
    const pills =
      pillsRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    pills?.[nextIndex]?.focus();
  };

  return (
    <StyledFilterPills
      ref={pillsRef}
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      $scrollOnMobile={scrollOnMobile}
    >
      {options.map((option) => {
        const isChecked = option.value === value;
        return (
          <StyledFilterPill
            key={option.value}
            id={`${idPrefix}-${option.value}`}
            type="button"
            role="radio"
            aria-checked={isChecked}
            tabIndex={isChecked ? 0 : -1}
            $isChecked={isChecked}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </StyledFilterPill>
        );
      })}
    </StyledFilterPills>
  );
}
