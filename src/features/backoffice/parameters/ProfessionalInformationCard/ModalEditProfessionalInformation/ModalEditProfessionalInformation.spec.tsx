import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { ModalEditProfessionalInformation } from './ModalEditProfessionalInformation';

const mockUpdateUserProfile = jest.fn();
const mockCloseModal = jest.fn();
const mockUpdateUserCompany = jest.fn();
jest.mock('@/src/hooks/useUpdateProfile', () => ({
  useUpdateProfile: () => ({
    updateUserProfile: mockUpdateUserProfile,
    closeModal: mockCloseModal,
  }),
}));
jest.mock('@/src/hooks', () => ({
  useUpdateUser: () => ({ updateUserCompany: mockUpdateUserCompany }),
}));
jest.mock('@/src/features/modals/Modal/ModalGeneric/ModalEdit', () => ({
  ModalEdit: ({ title, onSubmit, closeOnNextRender }: any) => (
    <div>
      <span>{title}</span>
      <button onClick={() => onSubmit({ job: 'dev' })}>submit</button>
      <button onClick={closeOnNextRender}>close</button>
    </div>
  ),
}));

const setup = (getValuesToSend: jest.Mock) =>
  render(
    <ModalEditProfessionalInformation
      title="Edit"
      description="desc"
      defaultValues={{}}
      formSchema={{} as any}
      getValuesToSend={getValuesToSend}
      user={{ id: 'u1' } as any}
    />
  );

describe('ModalEditProfessionalInformation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates the company and the profile separately from the submitted values', async () => {
    setup(
      jest.fn().mockReturnValue({ companyName: 'ACME', currentJob: 'Dev' })
    );
    fireEvent.click(screen.getByText('submit'));

    expect(mockUpdateUserCompany).toHaveBeenCalledWith('ACME');
    expect(mockUpdateUserProfile).toHaveBeenCalledWith({ currentJob: 'Dev' });
  });

  it('sends a null company when the company name is empty or missing', () => {
    setup(jest.fn().mockReturnValue({ companyName: '', currentJob: 'Dev' }));
    fireEvent.click(screen.getByText('submit'));

    expect(mockUpdateUserCompany).toHaveBeenCalledWith(null);
  });

  it('closes the modal through the profile update hook', () => {
    setup(jest.fn().mockReturnValue({}));
    fireEvent.click(screen.getByText('close'));

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
});
