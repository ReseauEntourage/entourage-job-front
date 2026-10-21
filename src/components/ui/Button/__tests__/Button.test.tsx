import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Button } from '../Button';
import { ButtonIcon } from '../ButtonIcon';

describe('Button', () => {
  it('renders its children in a button element', () => {
    render(<Button>Valider</Button>);
    const button = screen.getByRole('button', { name: 'Valider' });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Valider</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const onClick = jest.fn();
    render(
      <Button onClick={onClick} disabled>
        Valider
      </Button>
    );
    expect(screen.getByRole('button')).toBeDisabled();
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('exposes ariaLabel and dataTestId', () => {
    render(
      <Button ariaLabel="Fermer la fenetre" dataTestId="close-btn">
        X
      </Button>
    );
    expect(screen.getByTestId('close-btn')).toHaveAttribute(
      'aria-label',
      'Fermer la fenetre'
    );
  });

  it('calls the mouse enter and leave handlers', () => {
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();
    render(
      <Button onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        Hover
      </Button>
    );
    fireEvent.mouseEnter(screen.getByRole('button'));
    fireEvent.mouseLeave(screen.getByRole('button'));
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('renders prepend and append icons and gives them the button icon size', () => {
    const Icon = ({ size, name }: { size?: number; name: string }) => (
      <i data-testid={name} data-size={size} />
    );
    render(
      <Button
        prependIcon={<Icon name="before" />}
        appendIcon={<Icon name="after" size={5} />}
      >
        Label
      </Button>
    );
    expect(screen.getByTestId('before').getAttribute('data-size')).toBeTruthy();
    // An explicit icon size is preserved
    expect(screen.getByTestId('after')).toHaveAttribute('data-size', '5');
  });

  it('wraps the button in an external link opening in a new tab', () => {
    render(
      <Button href="https://example.com" isExternal newTab>
        Site
      </Button>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('rel', 'noopener');
    expect(link).toHaveAttribute('target', '_');
  });

  it('wraps the button in an external link in the same tab by default', () => {
    render(
      <Button href="https://example.com" isExternal>
        Site
      </Button>
    );
    expect(screen.getByRole('link')).not.toHaveAttribute('rel', 'noopener');
  });

  it('renders an internal link through next/link', () => {
    render(<Button href="/dashboard">Dashboard</Button>);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/dashboard');
  });
});

describe('ButtonIcon', () => {
  const Icon = ({ size }: { size?: number }) => (
    <i data-testid="icon" data-size={size} />
  );

  it('renders the icon inside an accessible button', () => {
    render(<ButtonIcon icon={<Icon />} ariaLabel="Supprimer" />);
    expect(screen.getByRole('button', { name: 'Supprimer' })).toBeVisible();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('forwards the click', () => {
    const onClick = jest.fn();
    render(
      <ButtonIcon icon={<Icon />} ariaLabel="Supprimer" onClick={onClick} />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when asked', () => {
    render(<ButtonIcon icon={<Icon />} ariaLabel="Supprimer" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders a link when href is given', () => {
    render(<ButtonIcon icon={<Icon />} href="/profil" ariaLabel="Profil" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/profil');
  });
});
