import isPropValid from '@emotion/is-prop-valid';

/**
 * Global safety net for styled-components v6: any non-transient prop that
 * isn't a valid HTML/SVG attribute gets filtered out before reaching a
 * native DOM element, instead of leaking through and triggering "unknown
 * prop"/React DOM warnings at runtime. ($-prefixed transient props are
 * already stripped by styled-components itself before this is consulted.)
 *
 * This only prevents the console symptom — it does not fail CI. Custom
 * style-only props should still be written as transient ($-prefixed) props
 * so a typo or a forgotten prefix surfaces as a real (silently dropped)
 * style bug rather than relying on this filter alone.
 */
export function shouldForwardProp(propName: string, target: unknown) {
  if (typeof target === 'string') {
    return isPropValid(propName);
  }
  return true;
}
