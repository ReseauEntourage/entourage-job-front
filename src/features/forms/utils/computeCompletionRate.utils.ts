export type CompletionRateOptions = {
  /**
   * Dot-paths to exclude from the completion computation.
   * Example: ['profileImageObjectUrl', 'some.nested.field']
   */
  excludePaths?: string[];
  /**
   * Extra “virtual” items to include in the computation (e.g. picture already uploaded).
   */
  additionalItems?: boolean[];
};

export type CompletionField = {
  path: string;
  isFilled: boolean;
};

type FlattenedField = CompletionField;

function isExcluded(path: string, exclude: Set<string>) {
  return exclude.has(path);
}

function isFilledPrimitive(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value);
  }

  if (typeof value === 'boolean') {
    return value === true;
  }

  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }

  // File / Blob
  if (typeof Blob !== 'undefined' && value instanceof Blob) {
    return true;
  }

  return false;
}

function flattenValues(
  value: unknown,
  path: string,
  out: FlattenedField[],
  exclude: Set<string>
) {
  if (path && isExcluded(path, exclude)) {
    return;
  }

  // Arrays count as 1 field: filled if at least one item
  if (Array.isArray(value)) {
    out.push({ path, isFilled: value.length > 0 });
    return;
  }

  // Primitive-ish values
  if (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value instanceof Date ||
    (typeof Blob !== 'undefined' && value instanceof Blob)
  ) {
    out.push({ path, isFilled: isFilledPrimitive(value) });
    return;
  }

  // Objects
  if (typeof value === 'object') {
    const asRecord = value as Record<string, unknown>;

    // react-select / FilterConstant pattern
    if ('value' in asRecord) {
      out.push({ path, isFilled: isFilledPrimitive(asRecord.value) });
      return;
    }

    const keys = Object.keys(asRecord);
    if (keys.length === 0) {
      out.push({ path, isFilled: false });
      return;
    }

    for (const key of keys) {
      const childPath = path ? `${path}.${key}` : key;
      flattenValues(asRecord[key], childPath, out, exclude);
    }

    return;
  }

  // Fallback: consider it empty
  out.push({ path, isFilled: false });
}

export function listCompletionFields(
  values: unknown,
  options: Pick<CompletionRateOptions, 'excludePaths'> = {}
): CompletionField[] {
  const exclude = new Set(options.excludePaths ?? []);
  const flattened: FlattenedField[] = [];

  flattenValues(values, '', flattened, exclude);

  return flattened.filter((f) => f.path.length > 0);
}

export function computeCompletionRate(
  values: unknown,
  options: CompletionRateOptions = {}
): number {
  const flattened = listCompletionFields(values, {
    excludePaths: options.excludePaths,
  });

  const additionalItems = options.additionalItems ?? [];

  const total = flattened.length + additionalItems.length;
  if (total === 0) {
    return 0;
  }

  const done =
    flattened.filter((f) => f.isFilled).length +
    additionalItems.filter(Boolean).length;

  return Math.round((done / total) * 100);
}
