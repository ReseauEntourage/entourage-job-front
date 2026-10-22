// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { formReferingAccountReferedCandidate } from './formReferingAccountReferedCandidate';
import { formReferingProfessionalInformation } from './formReferingProfessionalInformation';

const findField = (fields: any[], name: string): any => {
  for (const field of fields) {
    if (field.name === name) {
      return field;
    }
    if (field.fields) {
      const nested = findField(field.fields, name);
      if (nested) {
        return nested;
      }
    }
  }
  return undefined;
};

describe('formReferingAccountReferedCandidate', () => {
  const fields = formReferingAccountReferedCandidate.fields as any[];

  it('requires every field', () => {
    expect(fields.every((field) => field.isRequired)).toBe(true);
    expect(fields.map((field) => field.name)).toEqual([
      'firstName',
      'lastName',
      'gender',
      'phone',
      'email',
      'confirmReferingRules',
    ]);
  });

  it('accepts French phone numbers only when valid', () => {
    const [rule] = findField(fields, 'phone').rules;
    expect(rule.method('0612345678')).toBe(true);
    expect(rule.method('+33612345678')).toBe(true);
    expect(rule.method('0612')).toBe(false);
    expect(rule.method('')).toBe(false);
    expect(rule.method(undefined)).toBe(false);
    expect(rule.message).toBe('Numéro de téléphone invalide');
  });

  it('validates the email format', () => {
    const [rule] = findField(fields, 'email').rules;
    expect(rule.method('awa@entourage.social')).toBe(true);
    expect(rule.method('awa@')).toBe(false);
    expect(rule.method('not an email')).toBe(false);
  });
});

describe('formReferingProfessionalInformation', () => {
  const fields = formReferingProfessionalInformation.fields as any[];

  it('requires only the first business sector', () => {
    expect(findField(fields, 'businessSectorId0').isRequired).toBe(true);
    expect(findField(fields, 'businessSectorId1').isRequired).toBe(false);
  });

  it('requires the second sector only when a second occupation is filled', () => {
    const [rule] = findField(fields, 'businessSectorId1').rules;
    expect(rule.method(undefined, { occupation1: 'Cuisinier' })).toBe(false);
    expect(rule.method({ value: 'id' }, { occupation1: 'Cuisinier' })).toBe(
      true
    );
    expect(rule.method(undefined, {})).toBe(true);
    expect(rule.method(undefined, { occupation1: '' })).toBe(true);
  });
});
