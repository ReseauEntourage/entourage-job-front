import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useSelector } from 'react-redux';
import { EmailOtpInput } from './EmailOtpInput';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(() => jest.fn()),
}));

// Pulled in transitively via '@/src/components/ui' (Headings -> usePlatforms),
// which imports the ESM-only @react-hook/window-size.
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

describe('EmailOtpInput', () => {
  beforeEach(() => {
    (useSelector as unknown as jest.Mock).mockReturnValue(undefined);
  });

  it('shows a clickable "Modifier l\'email" button that calls onEditEmail', () => {
    const onEditEmail = jest.fn();
    render(
      <EmailOtpInput onCodeChange={jest.fn()} onEditEmail={onEditEmail} />
    );

    const button = screen.getByText("Modifier l'email");
    expect(button).not.toBeDisabled();

    fireEvent.click(button);
    expect(onEditEmail).toHaveBeenCalledTimes(1);
  });

  it('keeps "Modifier l\'email" enabled while digits are entered and during the resend cooldown', () => {
    const onEditEmail = jest.fn();
    render(
      <EmailOtpInput onCodeChange={jest.fn()} onEditEmail={onEditEmail} />
    );

    fireEvent.change(screen.getByLabelText('Chiffre 1'), {
      target: { value: '1' },
    });
    expect(screen.getByText("Modifier l'email")).not.toBeDisabled();

    fireEvent.click(screen.getByText(/^Renvoyer/));
    expect(screen.getByText("Modifier l'email")).not.toBeDisabled();
  });
});
