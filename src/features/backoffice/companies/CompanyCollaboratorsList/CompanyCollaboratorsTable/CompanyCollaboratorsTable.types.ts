export interface TableItem {
  id: string;
  name: string;
  email: string;
  connectionCounter: string;
  invitedAt: string;
  accountCreated: string;
}

export interface CompanyCollaboratorsTableProps {
  items: TableItem[];
}
