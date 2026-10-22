import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { useCurrentUserCompany } from '@/src/hooks/current-user/useCurrentUserCompany';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { createRecruitementAlertAction } from '@/src/use-cases/recruitement-alerts';
import { CompanyRecruitementAlertEditModal } from './CompanyRecruitementAlertEditModal';
import { CompanyRecruitementAlertModal } from './CompanyRecruitementAlertModal';

jest.mock('@/src/hooks/current-user/useCurrentUserCompany', () => ({
  useCurrentUserCompany: jest.fn(),
}));

let mockEditProps: any;
jest.mock('@/src/features/modals/Modal/ModalGeneric/ModalEdit', () => ({
  ModalEdit: (props: any) => {
    mockEditProps = props;
    const setError = (window as any).__setError;
    return (
      <div>
        <h1>{props.title}</h1>
        <button
          onClick={() =>
            props.onSubmit(
              {
                name: 'Alerte',
                jobName: 'Dev',
                department: { value: 'Paris (75)' },
                businessSectors: [{ value: 'bs1' }],
                workingExperience: { value: 3 },
                contract: { value: 'CDI' },
                skills: [{ value: 's1', label: 'JS' }],
              },
              (window as any).__onClose,
              setError
            )
          }
        >
          submit
        </button>
      </div>
    );
  },
}));
let mockGenericProps: any;
let mockFormProps: any;
jest.mock('@/src/features/modals/Modal/ModalGeneric', () => ({
  ModalGeneric: (props: any) => {
    mockGenericProps = props;
    return <div>{props.children}</div>;
  },
}));
jest.mock('@/src/features/forms/FormWithValidation', () => ({
  FormWithValidation: (props: any) => {
    mockFormProps = props;
    return (
      <div>
        <button
          onClick={() =>
            props.onSubmit({
              name: 'Edited',
              jobName: 'Ops',
              department: undefined,
              businessSectors: [{ value: 'bs2' }],
              workingExperience: { value: 5 },
              contract: { value: 'CDD' },
              skills: [],
            })
          }
        >
          save
        </button>
        <button onClick={props.onCancel}>cancel</button>
      </div>
    );
  },
}));

describe('CompanyRecruitementAlertModal (creation)', () => {
  const onClose = jest.fn();
  const setError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (window as any).__onClose = onClose;
    (window as any).__setError = setError;
  });

  it('creates the alert for the current company and closes the modal', () => {
    (useCurrentUserCompany as jest.Mock).mockReturnValue({ id: 'co1' });
    const store = createTestStore();
    const dispatch = jest.spyOn(store, 'dispatch');
    renderWithProviders(<CompanyRecruitementAlertModal />, { store });

    fireEvent.click(screen.getByText('submit'));

    expect(dispatch).toHaveBeenCalledWith(
      createRecruitementAlertAction({
        companyId: 'co1',
        name: 'Alerte',
        jobName: 'Dev',
        department: 'Paris (75)',
        businessSectorIds: ['bs1'],
        workingExperienceYears: 3,
        contractType: 'CDI',
        skills: [{ value: 's1', label: 'JS' }],
      } as any)
    );
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(setError).not.toHaveBeenCalled();
  });

  it('shows an error and keeps the modal open when the user has no company', () => {
    (useCurrentUserCompany as jest.Mock).mockReturnValue(null);
    renderWithProviders(<CompanyRecruitementAlertModal />);

    fireEvent.click(screen.getByText('submit'));

    expect(setError).toHaveBeenCalledWith(
      "Votre compte n'est associé à aucune entreprise"
    );
    expect(onClose).not.toHaveBeenCalled();
  });

  it('is titled for creation', () => {
    (useCurrentUserCompany as jest.Mock).mockReturnValue({ id: 'co1' });
    renderWithProviders(<CompanyRecruitementAlertModal />);

    expect(screen.getByText('Créer une alerte mail')).toBeInTheDocument();
    expect(mockEditProps.submitText).toBe("Créer l'alerte");
  });
});

describe('CompanyRecruitementAlertEditModal', () => {
  const onSubmit = jest.fn();
  const onClose = jest.fn();
  const alert = {
    id: 'a1',
    name: 'Alerte',
    jobName: 'Dev',
    department: 'Paris (75)',
    businessSectors: [{ id: 'bs1', name: 'Tech' }],
    workingExperienceYears: 3,
    contractType: 'CDI',
    skills: [{ id: 's1', name: 'JS' }],
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
    (useCurrentUserCompany as jest.Mock).mockReturnValue({ id: 'co1' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const setup = (isOpen = true, alertValue = alert) =>
    render(
      <CompanyRecruitementAlertEditModal
        alert={alertValue}
        onSubmit={onSubmit}
        isOpen={isOpen}
        onClose={onClose}
      />
    );

  it('renders nothing when closed', () => {
    const { container } = setup(false);

    expect(container).toBeEmptyDOMElement();
  });

  it('is prefilled with the alert criteria', () => {
    setup();

    expect(mockGenericProps.title).toBe('Modifier une alerte mail');
    expect(mockFormProps.defaultValues).toEqual(
      expect.objectContaining({
        name: 'Alerte',
        jobName: 'Dev',
        businessSectors: [{ value: 'bs1', label: 'Tech' }],
        skills: [{ value: 's1', label: 'JS' }],
      })
    );
  });

  it('tolerates an alert without optional criteria', () => {
    setup(true, { id: 'a2' });

    expect(mockFormProps.defaultValues).toEqual(
      expect.objectContaining({
        name: '',
        jobName: '',
        department: undefined,
        businessSectors: [],
        skills: [],
      })
    );
  });

  it('submits the updated alert for the current company, then closes', () => {
    setup();
    fireEvent.click(screen.getByText('save'));

    expect(onSubmit).toHaveBeenCalledWith({
      companyId: 'co1',
      name: 'Edited',
      jobName: 'Ops',
      department: null,
      businessSectorIds: ['bs2'],
      workingExperienceYears: 5,
      contractType: 'CDD',
      skills: [],
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('neither submits nor closes when the user has no company', () => {
    (useCurrentUserCompany as jest.Mock).mockReturnValue(null);
    setup();
    fireEvent.click(screen.getByText('save'));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes on cancel', () => {
    setup();
    fireEvent.click(screen.getByText('cancel'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
