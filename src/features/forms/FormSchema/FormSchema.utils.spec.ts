// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { FormComponents } from './FormSchema.types';
import {
  ComponentException,
  isFormFieldGroup,
  isFormFieldInput,
  isFormFieldMultiple,
  isFormFieldRadio,
  isFormFieldReactNode,
  isFormFieldSelect,
  isFormFieldSelectGraphic,
  isFormFieldSelectRequest,
  isFormFieldText,
  isFormFieldTextInput,
  mapFieldRules,
} from './FormSchema.utils';

const field = (component: string) => ({ component }) as never;

describe('mapFieldRules', () => {
  it('returns an empty object without rules', () => {
    expect(mapFieldRules(undefined as never)).toEqual({});
    expect(mapFieldRules([])).toEqual({});
  });

  it('builds one validator per rule, returning true or the message', () => {
    const rules = mapFieldRules([
      { method: (v) => !!v, message: 'required' },
      { method: (v) => String(v).length > 2, message: 'too short' },
    ] as never);

    expect(Object.keys(rules)).toEqual(['rule0', 'rule1']);
    expect(rules.rule0('abc', {} as never)).toBe(true);
    expect(rules.rule0('', {} as never)).toBe('required');
    expect(rules.rule1('ab', {} as never)).toBe('too short');
    expect(rules.rule1('abc', {} as never)).toBe(true);
  });

  it('passes the whole form values as second argument', () => {
    const method = jest.fn().mockReturnValue(true);
    const rules = mapFieldRules([{ method, message: 'm' }] as never);
    const values = { a: 1 };
    rules.rule0('x', values as never);
    expect(method).toHaveBeenCalledWith('x', values);
  });
});

describe('field type guards', () => {
  const cases: [string, (f: never) => boolean, string[]][] = [
    [
      'isFormFieldTextInput',
      isFormFieldTextInput,
      [
        FormComponents.DATEPICKER,
        FormComponents.TEXT_INPUT,
        FormComponents.TEL_INPUT,
        FormComponents.TEXTAREA,
      ],
    ],
    [
      'isFormFieldSelect',
      isFormFieldSelect,
      [
        FormComponents.SELECT_SIMPLE,
        FormComponents.RADIO,
        FormComponents.RADIO_ASYNC,
      ],
    ],
    [
      'isFormFieldRadio',
      isFormFieldRadio,
      [FormComponents.RADIO, FormComponents.RADIO_ASYNC],
    ],
    [
      'isFormFieldSelectRequest',
      isFormFieldSelectRequest,
      [
        FormComponents.SELECT,
        FormComponents.SELECT_CREATABLE,
        FormComponents.SELECT_ASYNC,
      ],
    ],
    [
      'isFormFieldSelectGraphic',
      isFormFieldSelectGraphic,
      [FormComponents.SELECT_LIST, FormComponents.SELECT_LIST_ASYNC],
    ],
    [
      'isFormFieldText',
      isFormFieldText,
      [FormComponents.HEADING, FormComponents.TEXT],
    ],
    ['isFormFieldReactNode', isFormFieldReactNode, [FormComponents.REACT_NODE]],
    ['isFormFieldGroup', isFormFieldGroup, [FormComponents.FIELDGROUP]],
    [
      'isFormFieldMultiple',
      isFormFieldMultiple,
      [FormComponents.MULTIPLE_FIELDS],
    ],
    [
      'isFormFieldInput',
      isFormFieldInput,
      [
        FormComponents.DATEPICKER,
        FormComponents.TEXT_INPUT,
        FormComponents.TEL_INPUT,
        FormComponents.TEXTAREA,
        FormComponents.CHECKBOX,
        FormComponents.CHECKBOX_ALERT,
        FormComponents.SELECT_SIMPLE,
        FormComponents.SELECT,
        FormComponents.SELECT_CREATABLE,
        FormComponents.SELECT_ASYNC,
        FormComponents.SELECT_LIST,
        FormComponents.SELECT_LIST_ASYNC,
        FormComponents.RADIO,
        FormComponents.RADIO_ASYNC,
        FormComponents.FILE,
      ],
    ],
  ];

  const allComponents = Object.values(FormComponents);

  cases.forEach(([name, guard, accepted]) => {
    it(`${name} accepts exactly its components`, () => {
      allComponents.forEach((component) => {
        expect(guard(field(component))).toBe(accepted.includes(component));
      });
      expect(guard(field('unknown'))).toBe(false);
    });
  });
});

describe('ComponentException', () => {
  it('describes an unknown component', () => {
    expect(new ComponentException('foo' as never).message).toBe(
      'Component foo does not exist'
    );
  });

  it('describes an invalid parent/child relation', () => {
    const error = new ComponentException(
      FormComponents.HEADING,
      FormComponents.MULTIPLE_FIELDS
    );
    expect(error.message).toBe(
      'Component heading can not be child of multiple-fields'
    );
    expect(error).toBeInstanceOf(Error);
  });
});
