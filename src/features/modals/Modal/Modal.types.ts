export type ModalSize = 'small' | 'medium' | 'large' | 'expand';

/**
 * `default`: centred box (bottom panel under the header on mobile).
 * `sheet`: same box on desktop; on mobile, a panel anchored to the bottom of
 * the screen, rounded at the top only, at most 92% of the screen high.
 */
export type ModalVariant = 'default' | 'sheet';
