// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { formSchema } from './formCompanyRecruitementAlert';

const getField = (name: string): any =>
  formSchema.fields.find((field: any) => field.name === name);

const failingMessages = (name: string, value: any) =>
  (getField(name).rules ?? [])
    .filter((rule: any) => !rule.method(value))
    .map((rule: any) => rule.message);

describe('formCompanyRecruitementAlert', () => {
  it('requires the name and the job only', () => {
    const required = formSchema.fields
      .filter((field: any) => field.isRequired)
      .map((field: any) => field.name);
    expect(required).toEqual(['name', 'jobName']);
  });

  it('bounds the alert name between 3 and 50 characters', () => {
    expect(failingMessages('name', 'ab')).toEqual([
      "Le nom de l'alerte doit contenir au moins 3 caractères",
    ]);
    expect(failingMessages('name', 'abc')).toEqual([]);
    expect(failingMessages('name', 'a'.repeat(50))).toEqual([]);
    expect(failingMessages('name', 'a'.repeat(51))).toEqual([
      "Le nom de l'alerte ne doit pas dépasser 50 caractères",
    ]);
  });

  it('caps the job name at 100 characters and accepts an empty one', () => {
    expect(failingMessages('jobName', '')).toEqual([]);
    expect(failingMessages('jobName', 'a'.repeat(100))).toEqual([]);
    expect(failingMessages('jobName', 'a'.repeat(101))).toHaveLength(1);
  });

  it('caps the business sectors at 20', () => {
    expect(failingMessages('businessSectors', undefined)).toEqual([]);
    expect(failingMessages('businessSectors', new Array(20).fill({}))).toEqual(
      []
    );
    expect(failingMessages('businessSectors', new Array(21).fill({}))).toEqual([
      "Vous ne pouvez pas sélectionner plus de 20 secteurs d'activité",
    ]);
  });

  it('caps the skills at 20 and each skill label at 50 characters', () => {
    expect(failingMessages('skills', undefined)).toEqual([]);
    expect(failingMessages('skills', [{ label: 'Vente' }, {}])).toEqual([]);
    expect(
      failingMessages('skills', new Array(21).fill({ label: 'a' }))
    ).toEqual(['Vous ne pouvez pas sélectionner plus de 20 compétences']);
    expect(failingMessages('skills', [{ label: 'a'.repeat(51) }])).toEqual([
      'Chaque compétence ne doit pas dépasser 50 caractères',
    ]);
  });

  it('delegates skills loading to the skills loader without creation', () => {
    expect(typeof getField('skills').loadOptions).toBe('function');
    expect(typeof getField('businessSectors').loadOptions).toBe('function');
  });
});
