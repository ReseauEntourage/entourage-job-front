import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { GenerateProfileConfirmModal } from './GenerateProfileConfirmModal';

const mockOnClose = jest.fn();
const mockGenerate = jest.fn();
let mockOnLoadingChange: (loading: boolean) => void;
jest.mock('@/src/features/modals/Modal', () => ({
  useModalContext: () => ({ onClose: mockOnClose }),
}));
jest.mock(
  '@/src/features/modals/Modal/ModalGeneric/ModalConfirm/ModalConfirm',
  () => ({
    ModalConfirm: ({
      buttonText,
      onConfirm,
      isLoading,
      keepOpenOnConfirm,
      children,
    }: any) => (
      <div>
        {children}
        <button onClick={onConfirm}>{buttonText}</button>
        <span data-testid="state">{`${isLoading}|${keepOpenOnConfirm}`}</span>
      </div>
    ),
  })
);
jest.mock(
  '../../profile/ProfileGenerationProcess/ProfileGenerationProcess',
  () => {
    const react = jest.requireActual('react');
    return {
      ProfileGenerationProcess: react.forwardRef((props: any, ref: any) => {
        react.useImperativeHandle(ref, () => ({
          generateProfileFromCV: mockGenerate,
        }));
        mockOnLoadingChange = props.onLoadingChange;
        return <button onClick={props.onProfileGenerated}>generated</button>;
      }),
    };
  }
);

describe('GenerateProfileConfirmModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('triggers the generation on confirm and keeps the modal open', () => {
    render(<GenerateProfileConfirmModal />);
    fireEvent.click(screen.getByText('Générer'));

    expect(mockGenerate).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('state')).toHaveTextContent('false|true');
  });

  it('reflects the generation loading state', () => {
    render(<GenerateProfileConfirmModal />);
    act(() => mockOnLoadingChange(true));

    expect(screen.getByTestId('state')).toHaveTextContent('true|true');
  });

  it('closes the modal once the profile is generated', () => {
    render(<GenerateProfileConfirmModal />);
    fireEvent.click(screen.getByText('generated'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
