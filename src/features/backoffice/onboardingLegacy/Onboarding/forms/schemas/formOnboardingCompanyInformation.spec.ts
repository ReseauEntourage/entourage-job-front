// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { formOnboardingCompanyInformation } from './formOnboardingCompanyInformation';

const fields = formOnboardingCompanyInformation.fields as any[];

describe('formOnboardingCompanyInformation', () => {
  it('requires the department only', () => {
    expect(
      fields.filter((field) => field.isRequired).map((field) => field.name)
    ).toEqual(['departmentId']);
  });

  it('accepts an empty LinkedIn link or a linkedin.com one', () => {
    const [rule] = fields.find((field) => field.name === 'linkedinUrl').rules;
    expect(rule.method('')).toBe(true);
    expect(rule.method(undefined)).toBe(true);
    expect(rule.method('https://www.linkedin.com/company/acme')).toBe(true);
    expect(rule.method('https://example.com/acme')).toBe(false);
    expect(rule.message).toBe('Doit être un lien Linkedin valide');
  });
});
