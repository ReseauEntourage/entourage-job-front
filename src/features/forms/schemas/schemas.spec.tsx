jest.mock('@/src/api');
// ESM-only dependency pulled by the UI barrel (cf. useContactEligibility.spec.tsx).
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1200,
  useWindowHeight: () => 800,
  useWindowSize: () => [1200, 800],
}));

// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { UserRoles } from '@/src/constants/users';
import { buildTestPassword } from '@/src/store/testUtils/buildTestPassword';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { FormSchema } from '../FormSchema';
import { formAddOrganization } from './formAddOrganization';
import { CREATE_NEW_ORGANIZATION_VALUE, formAddUser } from './formAddUser';
import { formChangePassword } from './formChangePassword';
import { formCompanyContact } from './formCompanyContact';
import { formDeleteUser } from './formDeleteUser';
import { formEditCandidateProfessionalInformation } from './formEditCandidateProfessionalInformation';
import { formEditCoachProfessionalInformation } from './formEditCoachProfessionalInformation';
import { formEditCompanyDescription } from './formEditCompanyDescription';
import { formEditCompanyInfos } from './formEditCompanyInfos';
import { formEditCompanyLinks } from './formEditCompanyLinks';
import {
  formEditCustomNudgeCandidate,
  formEditCustomNudgeCoach,
} from './formEditCustomNudge';
import { formEditDocuments } from './formEditDocuments';
import { formEditExperience } from './formEditExperience';
import { formEditFormation } from './formEditFormation';
import { formEditInterests } from './formEditInterests';
import { formEditLanguages } from './formEditLanguages';
import { formEditProfileDescriptionCandidate } from './formEditProfileDescriptionCandidate';
import { formEditProfileDescriptionCoach } from './formEditProfileDescriptionCoach';
import { formEditSkills } from './formEditSkills';
import { formFinalizeAccount } from './formFinalizeAccount';
import { formGetEmail } from './formGetEmail';
import {
  formHelpGroup,
  HELP_GROUP_DESCRIPTION_MAX_LENGTH,
  HELP_GROUP_NAME_MAX_LENGTH,
} from './formHelpGroup';
import { formInterestLinkedOut } from './formInterestLinkedOut';
import { formInviteCompanyCollaborators } from './formInviteCompanyCollaborators';
import { formLogin } from './formLogin';
import { formLostPwd } from './formLostPwd';
import {
  formPersonalDataAsAdmin,
  formPersonalDataAsCandidate,
  formPersonalDataAsCoach,
} from './formPersonalData';
import { formReport, REPORT_COMMENT_MAX_LENGTH } from './formReport';
import { formResetPassword } from './formResetPassword';
import { formAdminCreateMailingList } from './fromAdminCreateMailingList';
const ANOTHER_STRONG_PASSWORD = buildTestPassword();

const mockedApi = getMockedApi();

type AnyField = any;

// Flattens fieldgroup / multiple-fields children.
function allFields(fields: AnyField[]): AnyField[] {
  return fields.flatMap((field) => [
    field,
    ...(field.fields ? allFields(field.fields) : []),
  ]);
}

function getField(schema: FormSchema<any>, name: string): AnyField {
  const field = allFields(schema.fields as AnyField[]).find(
    (f) => f.name === name
  );
  if (!field) {
    throw new Error(`No field ${name} in ${schema.id}`);
  }
  return field;
}

// Messages of the rules of a field that reject the given value.
function failures(
  schema: FormSchema<any>,
  name: string,
  value: unknown,
  values: Record<string, unknown> = {}
): string[] {
  const rules: { method: AnyField; message: string }[] =
    getField(schema, name).rules ?? [];
  return rules
    .filter((rule) => !rule.method(value, values))
    .map((rule) => rule.message);
}

const VALID_PHONE = '+33612345678';
const STRONG_PASSWORD = buildTestPassword();
const EMAIL_ERROR = 'Adresse e-mail invalide';
const PHONE_ERROR = 'Numéro de téléphone invalide';
const PASSWORD_ERROR = 'Doit répondre aux critères de sécurité';
const MISMATCH_ERROR = 'Les deux mots de passe ne correspondent pas';
const LINKEDIN_ERROR = 'Doit être un lien Linkedin valide';

describe('form schemas', () => {
  describe('structure', () => {
    const schemas: Record<string, FormSchema<any>> = {
      formAddOrganization,
      formAddUser,
      formChangePassword,
      formCompanyContact,
      formDeleteUser,
      formEditCandidateProfessionalInformation,
      formEditCoachProfessionalInformation,
      formEditCompanyDescription,
      formEditCompanyInfos,
      formEditCompanyLinks,
      formEditCustomNudgeCandidate,
      formEditCustomNudgeCoach,
      formEditDocuments,
      formEditExperience,
      formEditFormation,
      formEditInterests,
      formEditLanguages,
      formEditProfileDescriptionCandidate,
      formEditProfileDescriptionCoach,
      formEditSkills,
      formFinalizeAccount,
      formGetEmail,
      formHelpGroup,
      formInterestLinkedOut,
      formInviteCompanyCollaborators,
      formLogin,
      formLostPwd,
      formPersonalDataAsAdmin,
      formPersonalDataAsCandidate,
      formPersonalDataAsCoach,
      formResetPassword,
      formAdminCreateMailingList,
    };

    Object.entries(schemas).forEach(([name, schema]) => {
      it(`${name} has an id and unique, consistent field names`, () => {
        expect(schema.id).toBeTruthy();
        const fields = allFields(schema.fields as AnyField[]);
        const names = fields.map((f) => f.name);
        expect(new Set(names).size).toBe(names.length);
        fields.forEach((f) => {
          expect(f.id).toBe(f.name);
          expect(f.component).toBeTruthy();
        });
      });
    });
  });

  describe('emails', () => {
    const emailFields: [string, FormSchema<any>, string][] = [
      ['formLogin', formLogin, 'email'],
      ['formLostPwd', formLostPwd, 'email'],
      ['formGetEmail', formGetEmail, 'email'],
      ['formCompanyContact', formCompanyContact, 'email'],
      ['formInterestLinkedOut', formInterestLinkedOut, 'email'],
      ['formAddUser', formAddUser, 'email'],
      ['formAddUser (referent)', formAddUser, 'referentMailOrganization'],
      ['formAddOrganization', formAddOrganization, 'referentMail'],
    ];

    emailFields.forEach(([label, schema, field]) => {
      it(`${label}.${field} accepts a valid address and rejects an invalid one`, () => {
        expect(failures(schema, field, 'jane.doe@example.com')).toEqual([]);
        expect(failures(schema, field, 'jane.doe@')).toEqual([EMAIL_ERROR]);
        expect(failures(schema, field, '')).toEqual([EMAIL_ERROR]);
      });
    });

    it('formLogin requires both fields', () => {
      expect(getField(formLogin, 'email').isRequired).toBe(true);
      expect(getField(formLogin, 'password').isRequired).toBe(true);
    });
  });

  describe('phones', () => {
    const phoneFields: [string, FormSchema<any>, string][] = [
      ['formAddUser', formAddUser, 'phone'],
      ['formAddUser (referent)', formAddUser, 'referentPhoneOrganization'],
      ['formAddOrganization', formAddOrganization, 'referentPhone'],
      ['formCompanyContact', formCompanyContact, 'phone'],
      ['formPersonalDataAsCandidate', formPersonalDataAsCandidate, 'phone'],
      ['formPersonalDataAsCoach', formPersonalDataAsCoach, 'phone'],
      ['formPersonalDataAsAdmin', formPersonalDataAsAdmin, 'phone'],
    ];

    phoneFields.forEach(([label, schema, field]) => {
      it(`${label}.${field} requires a valid French mobile number`, () => {
        expect(failures(schema, field, VALID_PHONE)).toEqual([]);
        expect(failures(schema, field, '+3361')).toEqual([PHONE_ERROR]);
        expect(failures(schema, field, '')).toEqual([PHONE_ERROR]);
        expect(failures(schema, field, undefined)).toEqual([PHONE_ERROR]);
      });
    });

    it('formInterestLinkedOut.phone is optional but must be valid when given', () => {
      expect(failures(formInterestLinkedOut, 'phone', '')).toEqual([]);
      expect(failures(formInterestLinkedOut, 'phone', undefined)).toEqual([]);
      expect(failures(formInterestLinkedOut, 'phone', VALID_PHONE)).toEqual([]);
      expect(failures(formInterestLinkedOut, 'phone', '+3361')).toEqual([
        PHONE_ERROR,
      ]);
    });
  });

  describe('passwords', () => {
    it('formChangePassword: the new password must differ from the old one and be strong', () => {
      const values = { oldPassword: STRONG_PASSWORD };
      expect(
        failures(formChangePassword, 'newPassword', STRONG_PASSWORD, values)
      ).toEqual([
        "Le nouveau mot de passe ne peux pas être le même que l'ancien",
      ]);
      expect(
        failures(formChangePassword, 'newPassword', 'abc', values)
      ).toEqual([PASSWORD_ERROR]);
      expect(
        failures(
          formChangePassword,
          'newPassword',
          ANOTHER_STRONG_PASSWORD,
          values
        )
      ).toEqual([]);
    });

    it('formChangePassword: accepts a new password when no old one is typed', () => {
      expect(
        failures(formChangePassword, 'newPassword', STRONG_PASSWORD, {})
      ).toEqual([]);
    });

    it('formChangePassword: the confirmation must be strong and match the new password', () => {
      const values = { newPassword: STRONG_PASSWORD };
      expect(
        failures(formChangePassword, 'confirmPassword', STRONG_PASSWORD, values)
      ).toEqual([]);
      expect(
        failures(
          formChangePassword,
          'confirmPassword',
          ANOTHER_STRONG_PASSWORD,
          values
        )
      ).toEqual([MISMATCH_ERROR]);
      expect(
        failures(formChangePassword, 'confirmPassword', 'abc', values)
      ).toEqual([PASSWORD_ERROR, MISMATCH_ERROR]);
    });

    it('formResetPassword: strength then match', () => {
      expect(
        failures(formResetPassword, 'newPassword', STRONG_PASSWORD)
      ).toEqual([]);
      expect(failures(formResetPassword, 'newPassword', 'abc')).toEqual([
        PASSWORD_ERROR,
      ]);
      const values = { newPassword: STRONG_PASSWORD };
      expect(
        failures(formResetPassword, 'confirmPassword', STRONG_PASSWORD, values)
      ).toEqual([]);
      expect(
        failures(
          formResetPassword,
          'confirmPassword',
          ANOTHER_STRONG_PASSWORD,
          values
        )
      ).toEqual([MISMATCH_ERROR]);
      expect(
        failures(formResetPassword, 'confirmPassword', 'abc', values)
      ).toEqual([PASSWORD_ERROR, MISMATCH_ERROR]);
    });

    it('formFinalizeAccount: strength then match', () => {
      expect(
        failures(formFinalizeAccount, 'setPassword', STRONG_PASSWORD)
      ).toEqual([]);
      expect(failures(formFinalizeAccount, 'setPassword', 'abc')).toEqual([
        PASSWORD_ERROR,
      ]);
      const values = { setPassword: STRONG_PASSWORD };
      expect(
        failures(
          formFinalizeAccount,
          'confirmPassword',
          STRONG_PASSWORD,
          values
        )
      ).toEqual([]);
      expect(
        failures(
          formFinalizeAccount,
          'confirmPassword',
          ANOTHER_STRONG_PASSWORD,
          values
        )
      ).toEqual([MISMATCH_ERROR]);
    });
  });

  describe('formDeleteUser', () => {
    it('only accepts the exact word SUPPRIMER', () => {
      expect(failures(formDeleteUser, 'confirmation', 'SUPPRIMER')).toEqual([]);
      expect(failures(formDeleteUser, 'confirmation', 'supprimer')).toEqual([
        'Confirmation non valide',
      ]);
      expect(failures(formDeleteUser, 'confirmation', '')).toEqual([
        'Confirmation non valide',
      ]);
    });
  });

  describe('LinkedIn links', () => {
    const linkedinFields: [string, FormSchema<any>, string][] = [
      ['formEditCompanyLinks', formEditCompanyLinks, 'linkedInUrl'],
      ['formEditDocuments', formEditDocuments, 'linkedinUrl'],
    ];

    linkedinFields.forEach(([label, schema, field]) => {
      it(`${label}.${field} is optional and must point to linkedin.com`, () => {
        expect(failures(schema, field, '')).toEqual([]);
        expect(failures(schema, field, undefined)).toEqual([]);
        expect(
          failures(schema, field, 'https://www.linkedin.com/in/jane')
        ).toEqual([]);
        expect(failures(schema, field, 'https://example.com/jane')).toEqual([
          LINKEDIN_ERROR,
        ]);
      });
    });
  });

  describe('formEditCandidateProfessionalInformation', () => {
    const field = 'businessSectorId1';
    const schema = formEditCandidateProfessionalInformation;

    it('requires a second sector once a second occupation is typed', () => {
      expect(
        failures(schema, field, undefined, { occupation1: 'Chef' })
      ).toEqual(['Obligatoire']);
      expect(
        failures(
          schema,
          field,
          { value: 'b1', label: 'BTP' },
          { occupation1: 'Chef' }
        )
      ).toEqual([]);
    });

    it('does not require the second sector without a second occupation', () => {
      expect(failures(schema, field, undefined, {})).toEqual([]);
    });

    it('requires the first sector', () => {
      expect(getField(schema, 'businessSectorId0').isRequired).toBe(true);
    });

    it('loads business sectors for both selects', async () => {
      mockedApi.getAllBusinessSectors.mockResolvedValue({
        data: [{ id: 'b1', name: 'BTP' }],
      } as never);
      const callback = jest.fn();
      await getField(schema, 'businessSectorId0').loadOptions(callback, 'bt');
      expect(callback).toHaveBeenCalledWith([{ value: 'b1', label: 'BTP' }]);
    });
  });

  describe('formInviteCompanyCollaborators', () => {
    const run = (emails: { value: string }[]) =>
      failures(formInviteCompanyCollaborators, 'emails', emails);

    it('accepts a list of valid emails and an empty list', () => {
      expect(run([{ value: 'a@b.fr' }, { value: 'c@d.com' }])).toEqual([]);
      expect(run([])).toEqual([]);
    });

    it('rejects the list if any address is invalid', () => {
      expect(run([{ value: 'a@b.fr' }, { value: 'nope' }])).toEqual([
        "L'une des adresses e-mail saisies est invalide",
      ]);
    });
  });

  describe('formHelpGroup', () => {
    ['name', 'description'].forEach((name) => {
      it(`${name} must not be blank`, () => {
        expect(failures(formHelpGroup, name, 'Something')).toEqual([]);
        expect(failures(formHelpGroup, name, '   ')).toEqual(['Obligatoire']);
        expect(failures(formHelpGroup, name, '')).toEqual(['Obligatoire']);
        expect(failures(formHelpGroup, name, undefined)).toEqual([
          'Obligatoire',
        ]);
      });
    });

    it('uses the same limits as the API', () => {
      expect(getField(formHelpGroup, 'name').maxLength).toBe(
        HELP_GROUP_NAME_MAX_LENGTH
      );
      expect(getField(formHelpGroup, 'description').maxLength).toBe(
        HELP_GROUP_DESCRIPTION_MAX_LENGTH
      );
      expect(HELP_GROUP_NAME_MAX_LENGTH).toBe(80);
      expect(HELP_GROUP_DESCRIPTION_MAX_LENGTH).toBe(500);
    });
  });

  describe('required fields and limits', () => {
    it('marks mandatory fields as required', () => {
      const required: [FormSchema<any>, string[]][] = [
        [
          formAddOrganization,
          [
            'name',
            'address',
            'zone',
            'referentFirstName',
            'referentLastName',
            'referentPhone',
            'referentMail',
          ],
        ],
        [
          formCompanyContact,
          [
            'firstName',
            'lastName',
            'approach',
            'email',
            'phone',
            'company',
            'position',
            'zone',
          ],
        ],
        [
          formInterestLinkedOut,
          ['lastName', 'firstName', 'email', 'message', 'cgu'],
        ],
        [formGetEmail, ['email', 'cgu']],
        [formEditExperience, ['title']],
        [formEditFormation, ['title']],
        [formEditCompanyInfos, ['departmentId']],
        [formEditCoachProfessionalInformation, ['businessSectorIds']],
        [formAdminCreateMailingList, ['recipientEmails', 'content']],
        [formFinalizeAccount, ['setPassword', 'confirmPassword']],
        [formResetPassword, ['newPassword', 'confirmPassword']],
        [formChangePassword, ['oldPassword', 'newPassword', 'confirmPassword']],
        [
          formPersonalDataAsCandidate,
          ['firstName', 'lastName', 'phone', 'department'],
        ],
        [
          formPersonalDataAsCoach,
          ['firstName', 'lastName', 'phone', 'department'],
        ],
        [
          formPersonalDataAsAdmin,
          ['firstName', 'lastName', 'zone', 'gender', 'phone'],
        ],
      ];
      required.forEach(([schema, names]) =>
        names.forEach((name) =>
          expect([schema.id, name, getField(schema, name).isRequired]).toEqual([
            schema.id,
            name,
            true,
          ])
        )
      );
    });

    it('keeps optional fields optional', () => {
      expect(getField(formCompanyContact, 'heardAbout').isRequired).toBeFalsy();
      expect(getField(formCompanyContact, 'message').isRequired).toBeFalsy();
      expect(
        getField(formInterestLinkedOut, 'structure').isRequired
      ).toBeFalsy();
      expect(getField(formEditLanguages, 'languages').isRequired).toBe(false);
    });

    it('declares the length limits of free text fields', () => {
      expect(getField(formCompanyContact, 'message').maxLength).toBe(1000);
      expect(getField(formInterestLinkedOut, 'message').maxLength).toBe(4000);
      expect(
        getField(formEditCompanyDescription, 'description').maxLength
      ).toBe(1000);
      expect(
        getField(formEditProfileDescriptionCandidate, 'description').maxLength
      ).toBe(1000);
      expect(getField(formEditExperience, 'title').maxLength).toBe(80);
      expect(getField(formEditExperience, 'description').maxLength).toBe(300);
      expect(getField(formEditFormation, 'title').maxLength).toBe(80);
      expect(getField(formEditFormation, 'institution').maxLength).toBe(60);
      expect(getField(formAdminCreateMailingList, 'content').minLength).toBe(
        10
      );
      expect(getField(formAdminCreateMailingList, 'content').maxLength).toBe(
        1200
      );
      expect(getField(formPersonalDataAsAdmin, 'description').minLength).toBe(
        50
      );
      expect(getField(formPersonalDataAsAdmin, 'description').maxLength).toBe(
        500
      );
    });

    it('declares the item limits of multi selects', () => {
      expect(getField(formEditInterests, 'interests').maxItems).toBe(10);
      expect(getField(formEditLanguages, 'languages').maxItems).toBe(10);
      expect(getField(formEditSkills, 'skills').maxItems).toBe(50);
      expect(getField(formEditExperience, 'skills').maxItems).toBe(50);
      expect(getField(formInviteCompanyCollaborators, 'emails').maxItems).toBe(
        100
      );
    });
  });

  describe('formEditSkills', () => {
    it('loads skills using the skill name as value', async () => {
      mockedApi.getAllSkills.mockResolvedValue({
        data: [{ id: 's1', name: 'Excel' }],
      } as never);
      const callback = jest.fn();

      await getField(formEditSkills, 'skills').loadOptions(callback, 'ex');

      expect(callback).toHaveBeenCalledWith([
        { value: 'Excel', label: 'Excel' },
      ]);
    });
  });

  describe('formPersonalData', () => {
    [
      formPersonalDataAsCandidate,
      formPersonalDataAsCoach,
      formPersonalDataAsAdmin,
    ].forEach((schema) => {
      it(`${schema.id}: the email-change warning shows only when an old email exists`, () => {
        const { hide } = getField(schema, 'newEmailWarning');
        expect(hide((name: string) => ({ oldEmail: 'a@b.fr' })[name])).toBe(
          false
        );
        expect(hide((name: string) => ({ oldEmail: '' })[name])).toBe(true);
      });
    });
  });

  describe('formAddUser', () => {
    const getValue = (values: Record<string, unknown>) => (name: string) =>
      values[name];
    const newOrg = { value: CREATE_NEW_ORGANIZATION_VALUE, label: 'new' };

    it('hides the organization group without a role or for admins', () => {
      const { hide } = getField(formAddUser, 'userOrganization');
      expect(hide(getValue({}))).toBe(true);
      expect(hide(getValue({ role: UserRoles.ADMIN }))).toBe(true);
      expect(hide(getValue({ role: UserRoles.COACH }))).toBe(false);
    });

    it('shows the organization select only for roles with an organization', () => {
      const { hide } = getField(formAddUser, 'organizationId');
      expect(hide(getValue({ role: UserRoles.REFERER }))).toBe(false);
      expect(hide(getValue({ role: UserRoles.COACH }))).toBe(true);
      expect(hide(getValue({ role: UserRoles.CANDIDATE }))).toBe(true);
    });

    it('shows the new organization fields only when creating one for a referer', () => {
      const names = [
        'organizationInformation',
        'nameOrganization',
        'addressOrganization',
        'zoneOrganization',
        'referentInformationOrganization',
        'referentInfoOrganization',
        'referentFirstNameOrganization',
        'referentLastNameOrganization',
        'referentPhoneOrganization',
        'referentMailOrganization',
      ];
      names.forEach((name) => {
        const { hide } = getField(formAddUser, name);
        expect(
          hide(getValue({ role: UserRoles.REFERER, organizationId: newOrg }))
        ).toBe(false);
        expect(
          hide(
            getValue({
              role: UserRoles.REFERER,
              organizationId: { value: 'org-1', label: 'Org' },
            })
          )
        ).toBe(true);
        expect(
          hide(getValue({ role: UserRoles.COACH, organizationId: newOrg }))
        ).toBe(true);
        expect(hide(getValue({}))).toBe(true);
      });
    });

    it('resets the organization when the role changes, and org fields when the organization changes', () => {
      expect(getField(formAddUser, 'role').fieldsToReset).toEqual([
        'organizationId',
      ]);
      expect(getField(formAddUser, 'organizationId').fieldsToReset).toContain(
        'nameOrganization'
      );
    });

    it('loads organizations after the "create new" option', async () => {
      mockedApi.getAllOrganizations.mockResolvedValue({
        data: [{ id: 'o1', name: 'Org 1' }],
      } as never);
      const callback = jest.fn();

      await getField(formAddUser, 'organizationId').loadOptions(callback, 'or');

      expect(mockedApi.getAllOrganizations).toHaveBeenCalledWith({
        params: { search: 'or', limit: 50, offset: 0 },
      });
      const options = callback.mock.calls[0][0];
      expect(options[0].value).toBe(CREATE_NEW_ORGANIZATION_VALUE);
      expect(options.slice(1)).toEqual([{ value: 'o1', label: 'Org 1' }]);
    });
  });

  describe('formReport', () => {
    it('exposes the shared reasons and the comment limit', () => {
      expect(formReport.reasons.map((r) => r.value)).toEqual([
        'SPAM',
        'FRAUD',
        'INSULTS',
        'IN_DANGER',
        'OTHER',
      ]);
      expect(formReport.commentMaxLength).toBe(REPORT_COMMENT_MAX_LENGTH);
      expect(REPORT_COMMENT_MAX_LENGTH).toBe(1000);
    });

    it('is incomplete only while no reason is chosen', () => {
      expect(formReport.isReasonMissing({ reason: '' })).toBe(true);
      expect(formReport.isReasonMissing({ reason: 'SPAM' })).toBe(false);
    });

    it('sends a trimmed comment, or none when it is blank', () => {
      expect(
        formReport.toDto({ reason: 'SPAM', comment: '  hello  ' })
      ).toEqual({
        reason: 'SPAM',
        comment: 'hello',
      });
      expect(formReport.toDto({ reason: 'FRAUD', comment: '   ' })).toEqual({
        reason: 'FRAUD',
      });
      expect(formReport.toDto({ reason: 'OTHER', comment: '' })).toEqual({
        reason: 'OTHER',
      });
    });
  });
});
