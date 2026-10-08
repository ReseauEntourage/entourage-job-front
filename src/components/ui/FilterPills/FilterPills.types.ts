export interface FilterPillOption<TValue extends string = string> {
  value: TValue;
  label: string;
}

export interface FilterPillsProps<TValue extends string = string> {
  options: FilterPillOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  // Accessible name of the radio group
  ariaLabel: string;
  // Prefix of the id of each pill, unique in the page
  idPrefix: string;
  // Below the desktop breakpoint, one scrolling line instead of wrapping
  scrollOnMobile?: boolean;
}
