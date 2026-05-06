import { AnyCantFix } from './Types';

function throwAssertionError(
  val: AnyCantFix,
  type: string,
  additionnalMessage = ''
) {
  throw new Error(
    `
      Assertion error: expected 'val' to be ${type}, but received ${val}
      ${additionnalMessage && `\n\n${additionnalMessage}`}
    `
  );
}

export function assertIsDefined<T>(
  val: T,
  message = ''
): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throwAssertionError(val, 'defined', message);
  }
}

export function assertCondition(
  condition: boolean,
  message = ''
): asserts condition {
  if (!condition) {
    throwAssertionError(condition, 'condition', message);
  }
}
