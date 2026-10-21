import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { CheckinIntroScreen } from './CheckinIntroScreen/CheckinIntroScreen';
import { CheckinProgressBar } from './CheckinProgressBar/CheckinProgressBar';
import { CheckinRatingInput } from './CheckinRatingInput/CheckinRatingInput';
import { CheckinStepShell } from './CheckinStepShell/CheckinStepShell';

let mockDesktop = true;
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => (mockDesktop ? 1280 : 400),
  useWindowSize: () => [mockDesktop ? 1280 : 400, 800],
}));
let mockStaffContact: { name: string } | null = null;
jest.mock('@/src/hooks/useCurrentUserStaffContact', () => ({
  useCurrentUserStaffContact: () => mockStaffContact,
}));

describe('CheckinProgressBar', () => {
  it('shows the current step out of the total', () => {
    render(<CheckinProgressBar current={2} total={6} />);

    expect(screen.getByText('Étape 2 sur 6')).toBeInTheDocument();
  });
});

describe('CheckinRatingInput', () => {
  it('reports the clicked star value', () => {
    const onChange = jest.fn();
    render(<CheckinRatingInput value={null} onChange={onChange} />);

    fireEvent.click(screen.getByLabelText('Noter 4 sur 5'));

    expect(onChange).toHaveBeenCalledWith(4);
    expect(screen.getAllByRole('button')).toHaveLength(5);
  });

  it('shows a legend for the scale', () => {
    render(<CheckinRatingInput value={3} onChange={jest.fn()} />);

    expect(
      screen.getByText(/1 = pas du tout satisfaisante/)
    ).toBeInTheDocument();
  });
});

describe('CheckinStepShell', () => {
  const other = { id: 'o1', firstName: 'Marie', role: UserRoles.COACH };
  const setup = (props: Record<string, unknown> = {}) => {
    const onContinue = jest.fn();
    renderWithProviders(
      <CheckinStepShell
        otherParticipant={other}
        otherParticipantHasPicture={false}
        currentIdx={1}
        question="Une question ?"
        canContinue
        onContinue={onContinue}
        {...props}
      >
        <div>contenu</div>
      </CheckinStepShell>
    );
    return onContinue;
  };

  beforeEach(() => {
    mockDesktop = true;
  });

  it('shows the question, its content and the progress', () => {
    setup();

    expect(screen.getByText('Vos échanges avec Marie')).toBeInTheDocument();
    expect(screen.getByText('Une question ?')).toBeInTheDocument();
    expect(screen.getByText('contenu')).toBeInTheDocument();
    expect(screen.getByText('Étape 2 sur 6')).toBeInTheDocument();
  });

  it('caps the progress at the total number of steps', () => {
    setup({ currentIdx: 6 });

    expect(screen.getByText('Étape 6 sur 6')).toBeInTheDocument();
  });

  it('works on mobile too', () => {
    mockDesktop = false;
    setup();

    expect(screen.getByText('Une question ?')).toBeInTheDocument();
  });

  it('calls onContinue when enabled', () => {
    const onContinue = setup();
    fireEvent.click(screen.getByText('Continuer'));

    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('disables Continue when the answer is not complete or while submitting', () => {
    setup({ canContinue: false });
    expect(screen.getByText('Continuer').closest('button')).toBeDisabled();
  });

  it('disables Continue while submitting', () => {
    setup({ isSubmitting: true });
    expect(screen.getByText('Continuer').closest('button')).toBeDisabled();
  });

  it('shows an error message', () => {
    setup({ error: 'Oups' });
    expect(screen.getByText('Oups')).toBeInTheDocument();
  });

  it('renders and triggers an optional secondary action', () => {
    const onClick = jest.fn();
    setup({ secondaryAction: { label: 'Passer', onClick } });
    fireEvent.click(screen.getByText('Passer'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('CheckinIntroScreen', () => {
  const user = { id: 'u1', firstName: 'Jean', role: UserRoles.CANDIDATE };
  const other = { id: 'o1', firstName: 'Marie', role: UserRoles.COACH };

  const setup = () => {
    const onStart = jest.fn();
    const onLater = jest.fn();
    renderWithProviders(
      <CheckinIntroScreen
        currentUser={user}
        currentUserHasPicture={false}
        otherParticipant={other}
        otherParticipantHasPicture={false}
        onStart={onStart}
        onLater={onLater}
      />
    );
    return { onStart, onLater };
  };

  beforeEach(() => {
    mockStaffContact = null;
  });

  it('personalises the intro with the other participant name', () => {
    setup();

    expect(
      screen.getByText('Un mois d’échanges avec Marie, comment ça se passe ?')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Si le courant est bien passé, vous pourrez le dire à Marie en un clic'
      )
    ).toBeInTheDocument();
  });

  it('names the staff contact when there is one', () => {
    mockStaffContact = { name: 'Sophie' };
    setup();

    expect(
      screen.getByText(
        "Si ça n'a pas marché, Sophie, votre référent peut vous appeler pour en parler"
      )
    ).toBeInTheDocument();
  });

  it('starts or postpones the checkin', () => {
    const { onStart, onLater } = setup();
    fireEvent.click(screen.getByText('Faire le bilan'));
    fireEvent.click(screen.getByText('Plus tard'));

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onLater).toHaveBeenCalledTimes(1);
  });
});
