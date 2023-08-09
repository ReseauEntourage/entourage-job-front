type UnionKeys<T> = T extends any ? keyof T : never;

type StrictUnionHelper<T, TAll> = T extends any
  ? T & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>>
  : never;

export type StrictUnion<T> = StrictUnionHelper<T, T>;

export type FilterConstant<
  T extends string | number | boolean = string | number | boolean
> = { value: T; label: string };

type MultiFilterConstant<M extends boolean> = M extends true
  ? FilterConstant[]
  : FilterConstant;

interface Rule<M extends boolean> {
  method: (fieldValue: MultiFilterConstant<M>) => boolean;
}

interface FormFieldInputCommonProperties<M extends boolean> {
  rules?: Rule<M>[];
}

interface FormFieldSelectRequestMulti
  extends FormFieldInputCommonProperties<true> {
  isMulti: true;
}

interface FormFieldSelectRequestSingle
  extends FormFieldInputCommonProperties<false> {
  isMulti: false;
}

type FormFieldSelectRequestOmit = Omit<
  FormFieldInputCommonProperties<false>,
  'isMulti'
>;

export type FormFieldSelectRequest = StrictUnion<
  | FormFieldSelectRequestMulti
  | FormFieldSelectRequestSingle
  | FormFieldSelectRequestOmit
>;

const test: FormFieldSelectRequest = {
  rules: [
    {
      method: (fieldValue) => {
        return true;
      },
    },
  ],
};
