jest.mock('@/src/components/ui/EthicsCharter/EthicsCharter', () => ({
  EthicsCharter: () => null,
}));

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { CurrentUserCompany, User } from '@/src/api/types';
import { formOnboardingCompanyGoal } from '../forms/schemas/formOnboardingCompanyGoal';
import { formOnboardingEthicsCharter } from '../forms/schemas/formOnboardingEthicsCharter';
import { CompanyOnboardingStepContents } from './CompanyOnboardingStepContent';

const user = {} as User;

describe('CompanyOnboardingStepContents', () => {
  it('skips the charter step only when the charter was already read', () => {
    const { skippedBy, defaultValues } = CompanyOnboardingStepContents[1];
    expect(skippedBy(user, { readDocuments: [], company: null })).toBe(false);
    expect(
      skippedBy(user, {
        readDocuments: [{ documentName: 'CharteEthique' } as any],
        company: null,
      })
    ).toBe(true);
    expect(defaultValues()).toEqual({ hasAcceptedEthicsCharter: false });
  });

  it('skips the goal step only when the company already has a goal', () => {
    const { skippedBy } = CompanyOnboardingStepContents[2];
    expect(skippedBy(user, { readDocuments: [], company: null })).toBe(false);
    expect(
      skippedBy(user, {
        readDocuments: [],
        company: { goal: 'RECRUIT' } as unknown as CurrentUserCompany,
      })
    ).toBe(true);
  });

  it('never skips the company information step', () => {
    expect((CompanyOnboardingStepContents[3] as any).skippedBy).toBeUndefined();
  });

  it('wires each step to its form', () => {
    expect(CompanyOnboardingStepContents[1].form).toBe(
      formOnboardingEthicsCharter
    );
    expect(CompanyOnboardingStepContents[2].form).toBe(
      formOnboardingCompanyGoal
    );
  });

  it('declares a mandatory multi select for the goals and a mandatory charter checkbox', () => {
    const goal = formOnboardingCompanyGoal.fields[0] as any;
    expect(goal).toEqual(
      expect.objectContaining({
        name: 'goal',
        component: 'select-list',
        isRequired: true,
        isMulti: true,
      })
    );
    expect(goal.options.map((o: any) => o.value)).toEqual([
      'sensibilize',
      'recruit',
    ]);
    expect(formOnboardingEthicsCharter.fields[0]).toEqual(
      expect.objectContaining({
        component: 'checkbox-alert',
        isRequired: true,
      })
    );
  });
});
