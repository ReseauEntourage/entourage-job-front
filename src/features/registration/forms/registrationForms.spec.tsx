jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

import { render } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
// Loaded first to settle the use-cases <-> forms import cycle in the right order.
import '@/src/use-cases/registration';
import { CandidateYesNo, CandidateYesNoNSPP } from '@/src/constants';
import { RegistrationFlow } from '@/src/features/registration/flows/flows.types';
import { buildTestPassword } from '@/src/store/testUtils/buildTestPassword';
import { formRegistrationAccount } from './formRegistrationAccount';
import { formRegistrationCandidateEconomicSocialInformation } from './formRegistrationCandidateEconomicSocialInformation';
import { formRegistrationCandidateInfo } from './formRegistrationCandidateInfo';
import { formRegistrationCoachInfo } from './formRegistrationCoachInfo';
import { formRegistrationCompanyRole } from './formRegistrationCompanyRole';
import { formRegistrationCompanySelection } from './formRegistrationCompanySelection';
import {
  FlowOptions,
  formRegistrationFlowSelection,
} from './formRegistrationFlowSelection';
import {
  CREATE_NEW_ORGANIZATION_VALUE,
  formRegistrationRefererAccount,
} from './formRegistrationRefererAccount';
const TEST_PASSWORD = buildTestPassword();

const mockedApi = jest.mocked(Api);

function findField(fields: any[], id: string): any {
  for (const field of fields) {
    if (field.id === id) {
      return field;
    }
    if (field.fields) {
      const nested = findField(field.fields, id);
      if (nested) {
        return nested;
      }
    }
  }
  return undefined;
}

const field = (schema: { fields: any[] }, id: string) =>
  findField(schema.fields, id);

// Runs every rule of a field and returns the messages of the failing ones.
function failures(
  schema: { fields: any[] },
  id: string,
  value: unknown,
  values: Record<string, unknown> = {}
) {
  return (field(schema, id).rules ?? [])
    .filter((rule: any) => !rule.method(value, values))
    .map((rule: any) => rule.message);
}

const yearsAgo = (years: number) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().slice(0, 10);
};

describe('birth date rules (candidate and coach)', () => {
  [
    ['candidate', formRegistrationCandidateInfo],
    ['coach', formRegistrationCoachInfo],
  ].forEach(([name, schema]: any) => {
    it(`${name}: accepts an adult`, () => {
      expect(failures(schema, 'birthDate', yearsAgo(30))).toEqual([]);
    });

    it(`${name}: refuses a minor`, () => {
      expect(failures(schema, 'birthDate', yearsAgo(17))).toEqual([
        'Vous devez avoir plus de 18 ans pour participer au programme Entourage Pro',
      ]);
    });

    it(`${name}: refuses an implausible birth date`, () => {
      expect(failures(schema, 'birthDate', yearsAgo(130))).toEqual([
        'Veuillez saisir une date de naissance valide',
      ]);
    });

    it(`${name}: requires a birth date and a department`, () => {
      expect(field(schema, 'birthDate').isRequired).toBe(true);
      expect(field(schema, 'department').isRequired).toBe(true);
    });
  });
});

describe('formRegistrationCandidateInfo working right', () => {
  it('refuses a candidate without the right to work', () => {
    expect(
      failures(
        formRegistrationCandidateInfo,
        'workingRight',
        CandidateYesNoNSPP.NO
      )
    ).toHaveLength(1);
  });

  it('accepts yes and "prefer not to say"', () => {
    expect(
      failures(
        formRegistrationCandidateInfo,
        'workingRight',
        CandidateYesNoNSPP.YES
      )
    ).toEqual([]);
    expect(
      failures(
        formRegistrationCandidateInfo,
        'workingRight',
        CandidateYesNoNSPP.NSPP
      )
    ).toEqual([]);
  });

  it('gives each radio option a distinct input id', () => {
    const ids = field(
      formRegistrationCandidateInfo,
      'workingRight'
    ).options.map((o: any) => o.inputId);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toMatch(/^working-right-/);
  });
});

describe('formRegistrationCandidateEconomicSocialInformation', () => {
  const schema = formRegistrationCandidateEconomicSocialInformation;

  it('refuses a candidate who is neither materially nor socially insecure', () => {
    const values = {
      materialInsecurity: CandidateYesNo.NO,
      networkInsecurity: CandidateYesNo.NO,
    };

    expect(
      failures(schema, 'materialInsecurity', CandidateYesNo.NO, values)
    ).toHaveLength(1);
    expect(
      failures(schema, 'networkInsecurity', CandidateYesNo.NO, values)
    ).toHaveLength(1);
  });

  it('accepts a candidate with at least one insecurity', () => {
    [
      {
        materialInsecurity: CandidateYesNo.YES,
        networkInsecurity: CandidateYesNo.NO,
      },
      {
        materialInsecurity: CandidateYesNo.NO,
        networkInsecurity: CandidateYesNo.YES,
      },
    ].forEach((values) => {
      expect(
        failures(
          schema,
          'materialInsecurity',
          values.materialInsecurity,
          values
        )
      ).toEqual([]);
      expect(
        failures(schema, 'networkInsecurity', values.networkInsecurity, values)
      ).toEqual([]);
    });
  });

  it('shows the eligibility alert only when both answers are no', () => {
    const hide = field(schema, 'programEligibilityAlert').hide;
    const getValue = (values: Record<string, unknown>) => (k: string) =>
      values[k];

    expect(
      hide(
        getValue({
          materialInsecurity: CandidateYesNo.NO,
          networkInsecurity: CandidateYesNo.NO,
        })
      )
    ).toBe(false);
    expect(
      hide(
        getValue({
          materialInsecurity: CandidateYesNo.YES,
          networkInsecurity: CandidateYesNo.NO,
        })
      )
    ).toBe(true);
    expect(hide(getValue({}))).toBe(true);
  });
});

describe('formRegistrationAccount', () => {
  it('validates the phone number as a French number', () => {
    expect(failures(formRegistrationAccount, 'phone', '0612345678')).toEqual(
      []
    );
    expect(failures(formRegistrationAccount, 'phone', '123')).toEqual([
      'Numéro de téléphone invalide',
    ]);
    expect(failures(formRegistrationAccount, 'phone', '')).toHaveLength(1);
  });

  it('validates the email format and rejects a malformed address', () => {
    expect(
      failures(formRegistrationAccount, 'email', 'ada@example.com')
    ).toEqual([]);
    expect(failures(formRegistrationAccount, 'email', 'ada@')).toHaveLength(1);
  });

  it('requires a strong enough password', () => {
    expect(failures(formRegistrationAccount, 'password', 'abc')).toHaveLength(
      1
    );
    expect(
      failures(formRegistrationAccount, 'password', TEST_PASSWORD)
    ).toEqual([]);
  });

  it('only shows the already-used hint for a manual email error', () => {
    const render_ = field(formRegistrationAccount, 'email').renderErrorContent;

    expect(render_({ type: 'required' })).toBeUndefined();
    expect(render_(undefined)).toBeUndefined();
    expect(render_({ type: 'manual' })).toBeTruthy();
  });

  it('makes the CGU mandatory and the newsletter optional', () => {
    expect(field(formRegistrationAccount, 'acceptCGU').isRequired).toBe(true);
    expect(field(formRegistrationAccount, 'optInNewsletter').isRequired).toBe(
      false
    );
    expect(() =>
      render(<>{field(formRegistrationAccount, 'acceptCGU').title}</>)
    ).not.toThrow();
  });
});

describe('formRegistrationRefererAccount', () => {
  const schema = formRegistrationRefererAccount;

  it('validates phone and email', () => {
    expect(failures(schema, 'phone', '0612345678')).toEqual([]);
    expect(failures(schema, 'phone', '12')).toHaveLength(1);
    expect(failures(schema, 'email', 'ada@example.com')).toEqual([]);
    expect(failures(schema, 'email', 'nope')).toEqual([
      'Adresse e-mail invalide',
    ]);
  });

  it('requires a strong password and a matching confirmation', () => {
    const strong = TEST_PASSWORD;

    expect(failures(schema, 'password', 'abc')).toHaveLength(1);
    expect(
      failures(schema, 'confirmPassword', strong, { password: strong })
    ).toEqual([]);
    expect(
      failures(schema, 'confirmPassword', strong, { password: `${strong}x` })
    ).toEqual(['Les deux mots de passe ne correspondent pas']);
    expect(
      failures(schema, 'confirmPassword', 'abc', { password: 'abc' })
    ).toEqual(['Doit répondre aux critères ci-dessus']);
  });

  it('shows the organization name only when creating a new organization', () => {
    const hide = field(schema, 'nameOrganization').hide;

    expect(hide(() => ({ value: CREATE_NEW_ORGANIZATION_VALUE }))).toBe(false);
    expect(hide(() => ({ value: 'org-1' }))).toBe(true);
    expect(hide(() => undefined)).toBe(true);
  });

  it('loads organizations matching the search plus the creation option', async () => {
    mockedApi.getAllOrganizations.mockResolvedValue({
      data: [{ id: 'o1', name: 'Asso 1' }],
    } as any);
    const callback = jest.fn();

    await field(schema, 'organizationId').loadOptions(callback, 'ass');

    expect(mockedApi.getAllOrganizations).toHaveBeenCalledWith({
      params: { search: 'ass', limit: 50, offset: 0 },
    });
    const options = callback.mock.calls[0][0];
    expect(options[0]).toEqual({ value: 'o1', label: 'Asso 1' });
    expect(options[options.length - 1].value).toBe(
      CREATE_NEW_ORGANIZATION_VALUE
    );
    expect(() =>
      render(<>{options[options.length - 1].label}</>)
    ).not.toThrow();
  });

  it('returns no option when the organization search fails', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedApi.getAllOrganizations.mockRejectedValue(new Error('boom'));
    const callback = jest.fn();

    await field(schema, 'organizationId').loadOptions(callback, 'x');

    expect(callback).toHaveBeenCalledWith([]);
    error.mockRestore();
  });
});

describe('selection forms', () => {
  it('flow selection offers the four registration flows', () => {
    expect(FlowOptions.map((o) => o.value)).toEqual([
      RegistrationFlow.CANDIDATE,
      RegistrationFlow.COACH,
      RegistrationFlow.REFERER,
      RegistrationFlow.COMPANY,
    ]);
    const options = field(formRegistrationFlowSelection, 'flow').options;

    expect(options).toHaveLength(4);
    expect(field(formRegistrationFlowSelection, 'flow').isRequired).toBe(true);
    options.forEach((o: any) => {
      expect(() => render(<>{o.label}</>)).not.toThrow();
    });
  });

  it('company role and company selection fields are required', () => {
    expect(formRegistrationCompanyRole.fields.length).toBeGreaterThan(0);
    formRegistrationCompanyRole.fields.forEach((f: any) => {
      expect(f.isRequired).toBe(true);
    });
    expect(formRegistrationCompanySelection.fields.length).toBeGreaterThan(0);
  });
});
