import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { openModal } from '@/src/features/modals/Modal';
import { useSelectedCompany } from '@/src/hooks/useSelectedCompany';
import { CompanyCollaboratorsTable } from './CompanyCollaboratorsList/CompanyCollaboratorsTable/CompanyCollaboratorsTable';
import { CompanyParameters } from './CompanyParameters/CompanyParameters';
import { CompanyDescription } from './CompanyProfile/CompanyParts/CompanyDescription/CompanyDescription';
import { ModalEditCompanyDescription } from './CompanyProfile/CompanyParts/CompanyDescription/ModalEditCompanyDescription/ModalEditCompanyDescription';
import { CompanyProfile } from './CompanyProfile/CompanyProfile';
import { CompanyInfosModalEdit } from './modals/CompanyInfosModalEdit';
import { CompanyLinksModalEdit } from './modals/CompanyLinksModalEdit';

let mockDesktop = true;
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => (mockDesktop ? 1280 : 400),
  useWindowSize: () => [mockDesktop ? 1280 : 400, 800],
}));
jest.mock('@/src/features/modals/Modal', () => ({
  openModal: jest.fn(),
  useModalContext: () => ({}),
}));
jest.mock('@/src/hooks/useSelectedCompany', () => ({
  useSelectedCompany: jest.fn(),
}));
const mockUpdateCompany = jest.fn();
const mockCloseModal = jest.fn();
jest.mock('@/src/hooks/useUpdateCompany', () => ({
  useUpdateCompany: () => ({
    updateCompany: mockUpdateCompany,
    closeModal: mockCloseModal,
  }),
}));
let mockEditProps: any;
jest.mock('@/src/features/modals/Modal/ModalGeneric/ModalEdit', () => ({
  ModalEdit: (props: any) => {
    mockEditProps = props;
    return (
      <div>
        <h1>{props.title}</h1>
        <button
          onClick={() =>
            props.onSubmit({ description: 'new', url: 'u' }, mockOnClose)
          }
        >
          submit
        </button>
      </div>
    );
  },
}));
const mockOnClose = jest.fn();
jest.mock('@/src/features/headers/HeaderCompany/HeaderCompany', () => ({
  HeaderCompany: ({ name, isEditable }: any) => (
    <div data-testid="part">{`header:${name}:${isEditable}`}</div>
  ),
}));
jest.mock('@/src/components/layouts/LayoutBackOffice', () => ({
  LayoutBackOffice: ({ title, children }: any) => (
    <div data-testid="layout" data-title={title}>
      {children}
    </div>
  ),
}));
jest.mock(
  './CompanyProfile/CompanyParts/CompanyCollaboratorsPreviewList/CompanyCollaboratorsPreviewList',
  () => ({
    CompanyCollaboratorsPreviewList: ({ companyId, isEditable }: any) => (
      <div data-testid="part">{`collaborators:${companyId}:${isEditable}`}</div>
    ),
  })
);
jest.mock('./CompanyProfile/CompanyParts/CompanyLinks/CompanyLinks', () => ({
  CompanyLinks: ({ name, isEditable }: any) => (
    <div data-testid="part">{`links:${name}:${isEditable}`}</div>
  ),
}));

const parts = () => screen.getAllByTestId('part').map((el) => el.textContent);

describe('CompanyProfile (read-only view)', () => {
  beforeEach(() => {
    mockDesktop = true;
  });

  it('renders nothing without a selected company', () => {
    (useSelectedCompany as jest.Mock).mockReturnValue({
      selectedCompany: null,
    });
    const { container } = render(<CompanyProfile />);

    expect(container).toBeEmptyDOMElement();
  });

  it('shows read-only header, description, collaborators and links', () => {
    (useSelectedCompany as jest.Mock).mockReturnValue({
      selectedCompany: { id: 'c1', name: 'Acme', description: 'Une boîte' },
    });
    render(<CompanyProfile />);

    expect(parts()).toEqual([
      'header:Acme:false',
      'collaborators:c1:false',
      'links:Acme:false',
    ]);
    expect(screen.getByText('Une boîte')).toBeInTheDocument();
  });

  it('hides the description card when the company has none', () => {
    (useSelectedCompany as jest.Mock).mockReturnValue({
      selectedCompany: { id: 'c1', name: 'Acme', description: null },
    });
    render(<CompanyProfile />);

    expect(screen.queryByText('Présentation')).not.toBeInTheDocument();
  });
});

describe('CompanyParameters (editable view)', () => {
  it('shows the editable company page in the "Mon entreprise" layout', () => {
    render(
      <CompanyParameters
        company={
          {
            id: 'c1',
            name: 'Acme',
            description: null,
            logoUrl: null,
            department: null,
          } as any
        }
      />
    );

    expect(screen.getByTestId('layout')).toHaveAttribute(
      'data-title',
      'Mon entreprise'
    );
    expect(parts()).toEqual([
      'header:Acme:true',
      'collaborators:c1:true',
      'links:Acme:true',
    ]);
    expect(screen.getByText('Ajouter')).toBeInTheDocument();
  });
});

describe('CompanyDescription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('invites an editor to write a presentation, and opens the edition modal', () => {
    render(<CompanyDescription description={null} isEditable />);

    expect(
      screen.getByText('Ecrire une courte présentation de votre entreprise')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('Ajouter'));
    const element = (openModal as jest.Mock).mock.calls[0][0];
    expect(element.type).toBe(ModalEditCompanyDescription);
    expect(element.props.description).toBeNull();
  });

  it('shows the description with a "Modifier" action for an editor', () => {
    render(<CompanyDescription description="Texte" isEditable />);

    expect(screen.getByText('Texte')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Modifier'));
    expect((openModal as jest.Mock).mock.calls[0][0].props.description).toBe(
      'Texte'
    );
  });

  it('offers no action to a visitor', () => {
    render(<CompanyDescription description="Texte" />);

    expect(screen.queryByText('Modifier')).not.toBeInTheDocument();
    expect(screen.queryByText('Ajouter')).not.toBeInTheDocument();
  });
});

describe('ModalEditCompanyDescription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('is prefilled with the current description (or empty)', () => {
    const { unmount } = render(
      <ModalEditCompanyDescription description="Texte" />
    );
    expect(mockEditProps.defaultValues).toEqual({ description: 'Texte' });
    unmount();

    render(<ModalEditCompanyDescription description={null} />);
    expect(mockEditProps.defaultValues).toEqual({ description: '' });
  });

  it('updates the company description then closes', () => {
    render(<ModalEditCompanyDescription description="Texte" />);
    fireEvent.click(screen.getByText('submit'));

    expect(mockUpdateCompany).toHaveBeenCalledWith({ description: 'new' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe('CompanyInfosModalEdit', () => {
  const dispatchOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('is prefilled with the department and business sectors', () => {
    render(
      <CompanyInfosModalEdit
        dispatchOnSubmit={dispatchOnSubmit}
        department={{ id: 'd1', name: 'Paris' } as any}
        businessSectors={[{ id: 'bs1', name: 'Tech' } as any]}
      />
    );

    expect(mockEditProps.defaultValues).toEqual({
      departmentId: { value: 'd1', label: 'Paris' },
      businessSectorIds: [{ value: 'bs1', label: 'Tech' }],
    });
  });

  it('submits the fields and asks to close the modal on next render', () => {
    render(<CompanyInfosModalEdit dispatchOnSubmit={dispatchOnSubmit} />);
    expect(mockEditProps.closeOnNextRender).toBe(false);

    fireEvent.click(screen.getByText('submit'));

    expect(dispatchOnSubmit).toHaveBeenCalledWith({
      description: 'new',
      url: 'u',
    });
    expect(mockEditProps.closeOnNextRender).toBe(true);
  });
});

describe('CompanyLinksModalEdit', () => {
  const dispatchOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('is prefilled with the links, using empty strings for missing ones', () => {
    render(
      <CompanyLinksModalEdit
        dispatchOnSubmit={dispatchOnSubmit}
        url="acme.fr"
        linkedInUrl={null}
      />
    );

    expect(mockEditProps.defaultValues).toEqual({
      url: 'acme.fr',
      linkedInUrl: '',
      hiringUrl: '',
    });
  });

  it('submits the links and closes on next render', () => {
    render(<CompanyLinksModalEdit dispatchOnSubmit={dispatchOnSubmit} />);
    fireEvent.click(screen.getByText('submit'));

    expect(dispatchOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockEditProps.closeOnNextRender).toBe(true);
  });
});

describe('CompanyCollaboratorsTable', () => {
  const items = [
    {
      id: '1',
      name: 'Jane Doe',
      email: 'jane@acme.fr',
      connectionCounter: '3',
      invitedAt: '01/01/2026',
      accountCreated: '02/01/2026',
    },
    {
      id: '2',
      name: '-',
      email: 'invited@acme.fr',
      connectionCounter: '-',
      invitedAt: '03/01/2026',
      accountCreated: '-',
    },
  ];

  it('shows a column per piece of information on desktop', () => {
    mockDesktop = true;
    render(<CompanyCollaboratorsTable items={items} />);

    [
      'Collaborateurs',
      'Mail',
      'Candidats contactés',
      'Invitation envoyée',
      'Compte créé',
    ].forEach((h) => expect(screen.getByText(h)).toBeInTheDocument());
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('invited@acme.fr')).toBeInTheDocument();
  });

  it('shows cards on mobile, hiding the fields that have no value', () => {
    mockDesktop = false;
    render(<CompanyCollaboratorsTable items={items} />);

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getAllByText('Nom')).toHaveLength(1);
    expect(screen.getAllByText('Candidat(s) contacté(s)')).toHaveLength(1);
    expect(screen.getAllByText('Mail')).toHaveLength(2);
  });
});
