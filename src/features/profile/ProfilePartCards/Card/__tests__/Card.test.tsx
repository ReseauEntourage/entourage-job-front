import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { ProfilePartCard } from '../Card/Card';
import { CardEmptyContent } from '../CardEmptyContent/CardEmptyContent';
import { CardTagList } from '../CardTagList/CardTagList';
import { CardTitle } from '../CardTitle/CardTitle';
import { CardToggleList } from '../CardToggleList/CardToggleList';
import { ToggleItem } from '../CardToggleList/ToggleItem/ToggleItem';

describe('ProfilePartCard', () => {
  it('shows the children and a "Modifier" CTA when completed', () => {
    const cta = jest.fn();
    render(
      <ProfilePartCard title="Titre" isCompleted ctaCallback={cta}>
        <p>Contenu</p>
      </ProfilePartCard>
    );
    expect(screen.getByText('Contenu')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Modifier' }));
    expect(cta).toHaveBeenCalledTimes(1);
  });

  it('shows the fallback and an "Ajouter" CTA when empty', () => {
    render(
      <ProfilePartCard
        title="Titre"
        isCompleted={false}
        ctaCallback={jest.fn()}
      >
        <p>Contenu</p>
      </ProfilePartCard>
    );
    expect(screen.queryByText('Contenu')).not.toBeInTheDocument();
    expect(
      screen.getByText('Commencez par renseigner cette partie')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ajouter' })).toBeInTheDocument();
  });

  it('uses a custom fallback and CTA title', () => {
    render(
      <ProfilePartCard
        title="Titre"
        isEmpty
        ctaCallback={jest.fn()}
        ctaTitle="Créer"
        fallback={{ content: 'Rien ici', icon: <span /> }}
      >
        <p>Contenu</p>
      </ProfilePartCard>
    );
    expect(screen.getByText('Rien ici')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Créer' })).toBeInTheDocument();
  });

  it('renders no CTA without callback or with a null title', () => {
    const { rerender } = render(
      <ProfilePartCard title="Titre" isCompleted>
        <p>Contenu</p>
      </ProfilePartCard>
    );
    expect(screen.queryByRole('button', { name: 'Modifier' })).toBeNull();
    rerender(
      <ProfilePartCard
        title="Titre"
        isCompleted
        ctaCallback={jest.fn()}
        ctaTitle={null}
      >
        <p>Contenu</p>
      </ProfilePartCard>
    );
    expect(screen.queryByRole('button', { name: 'Modifier' })).toBeNull();
  });
});

describe('CardEmptyContent', () => {
  it('renders title and content', () => {
    render(
      <CardEmptyContent title="Vide" content="Pas de données" icon={<i />} />
    );
    expect(screen.getByText('Vide')).toBeInTheDocument();
    expect(screen.getByText('Pas de données')).toBeInTheDocument();
  });
});

describe('CardTitle', () => {
  it('shows no status icon when not editable', () => {
    const { container } = render(<CardTitle title="Mon titre" isCompleted />);
    expect(screen.getByText(/Mon titre/)).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeNull();
  });

  it('shows a status icon when editable and completion is known', () => {
    const { container } = render(
      <CardTitle title="Mon titre" isCompleted={false} isEditable />
    );
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('shows no status icon when completion is undefined', () => {
    const { container } = render(<CardTitle title="Mon titre" isEditable />);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('shows the AI mention only when editable and iaGenerated', () => {
    const { rerender } = render(<CardTitle title="T" isEditable iaGenerated />);
    expect(screen.getByText("Généré par l'IA")).toBeInTheDocument();
    rerender(<CardTitle title="T" iaGenerated />);
    expect(screen.queryByText("Généré par l'IA")).toBeNull();
  });
});

describe('CardTagList', () => {
  const items = [{ name: 'React' }, { name: 'Node' }];

  it('renders every tag', () => {
    render(<CardTagList items={items} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node')).toBeInTheDocument();
  });

  it('renders nothing for no items', () => {
    const { container } = render(<CardTagList />);
    expect(container.querySelectorAll('button')).toHaveLength(0);
  });

  it('calls removeCallback with the index when editable', () => {
    const remove = jest.fn();
    render(<CardTagList items={items} isEditable removeCallback={remove} />);
    const removeButtons = screen.getAllByRole('button');
    fireEvent.click(removeButtons[1]);
    expect(remove).toHaveBeenCalledWith(1);
  });

  it('offers no removal when not editable', () => {
    render(<CardTagList items={items} removeCallback={jest.fn()} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});

describe('ToggleItem', () => {
  it('shows the switch only when editable', () => {
    const { rerender } = render(<ToggleItem name="Option" checked />);
    expect(screen.getByText('Option')).toBeInTheDocument();
    expect(screen.queryByRole('switch')).toBeNull();
    rerender(<ToggleItem name="Option" checked isEditable />);
    expect(screen.getByRole('switch')).toBeChecked();
  });
});

describe('CardToggleList', () => {
  const items = [
    { name: 'A', value: true },
    { name: 'B', value: false },
  ];

  it('hides disabled items when not editable', () => {
    render(<CardToggleList items={items} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.queryByText('B')).toBeNull();
  });

  it('shows all items when editable and reports the toggled list', () => {
    const onChange = jest.fn();
    render(<CardToggleList items={items} isEditable onChange={onChange} />);
    expect(screen.getByText('B')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('switch')[1]);
    expect(onChange).toHaveBeenCalledWith([
      { name: 'A', value: true },
      { name: 'B', value: true },
    ]);
  });

  it('does not crash without onChange', () => {
    render(<CardToggleList items={items} isEditable />);
    fireEvent.click(screen.getAllByRole('switch')[0]);
    expect(screen.getByText('A')).toBeInTheDocument();
  });
});
