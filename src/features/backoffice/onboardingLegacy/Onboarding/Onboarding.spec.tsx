const mockFormProps = jest.fn();
jest.mock('../useOnboarding', () => ({ useOnboarding: jest.fn() }));
jest.mock('@/src/features/modals/Modal/ModalGeneric', () => ({
  ModalGeneric: ({ title, description, children }: any) => (
    <div>
      <h1>{title}</h1>
      <h2>{description}</h2>
      {children}
    </div>
  ),
}));
jest.mock('@/src/features/forms/FormWithValidation', () => ({
  FormWithValidation: (props: any) => {
    mockFormProps(props);
    return <div data-testid="form" />;
  },
}));

import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { useOnboarding } from '../useOnboarding';
import { Onboarding } from './Onboarding';

const mockUseOnboarding = useOnboarding as jest.Mock;

const baseState = {
  isOnboardingLoading: false,
  stepContent: {
    title: 'Titre',
    subtitle: 'Sous-titre',
    content: <p>Contenu</p>,
    form: { id: 'form', fields: [] },
  },
  defaultValues: { a: 1, b: 1 },
  isFirstOnboardingStep: false,
  onSubmitStepForm: jest.fn(),
  onBeforeStep: jest.fn(),
  currentStep: 2,
  stepData: { b: 2 },
  disableNavigationButtons: false,
};

describe('Onboarding (legacy)', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => cleanup());

  it('renders nothing when no step is active', () => {
    mockUseOnboarding.mockReturnValue({ ...baseState, currentStep: 0 });
    const { container } = render(<Onboarding />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the step content and the form with merged default values', () => {
    mockUseOnboarding.mockReturnValue(baseState);
    render(<Onboarding />);
    expect(screen.getByText('Titre')).toBeInTheDocument();
    expect(screen.getByText('Sous-titre')).toBeInTheDocument();
    expect(screen.getByText('Contenu')).toBeInTheDocument();
    expect(screen.getByTestId('form')).toBeInTheDocument();
    expect(mockFormProps).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: { a: 1, b: 2 },
        submitText: 'Suivant',
        cancelText: 'Précédent',
        onCancel: baseState.onBeforeStep,
        onSubmit: baseState.onSubmitStepForm,
        disabled: false,
      })
    );
  });

  it('gives no cancel handler on the first step and forwards the disabled flag', () => {
    mockUseOnboarding.mockReturnValue({
      ...baseState,
      isFirstOnboardingStep: true,
      disableNavigationButtons: true,
    });
    render(<Onboarding />);
    const props = mockFormProps.mock.calls[0][0];
    expect(props.onCancel).toBeUndefined();
    expect(props.disabled).toBe(true);
  });

  it('shows only a spinner while loading', () => {
    mockUseOnboarding.mockReturnValue({
      ...baseState,
      isOnboardingLoading: true,
    });
    render(<Onboarding />);
    expect(screen.queryByTestId('form')).toBeNull();
    expect(screen.queryByText('Contenu')).toBeNull();
  });

  it('renders without a form when the step has none', () => {
    mockUseOnboarding.mockReturnValue({
      ...baseState,
      stepContent: { title: 'Seul' },
    });
    render(<Onboarding />);
    expect(screen.getByText('Seul')).toBeInTheDocument();
    expect(screen.queryByTestId('form')).toBeNull();
  });

  it('renders empty titles when the step content is missing', () => {
    mockUseOnboarding.mockReturnValue({ ...baseState, stepContent: null });
    render(<Onboarding />);
    expect(screen.queryByTestId('form')).toBeNull();
  });
});
