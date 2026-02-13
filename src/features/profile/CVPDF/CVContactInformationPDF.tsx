import React from 'react';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import {
  DepartmentName,
  DEPARTMENTS_FILTERS,
} from 'src/constants/departements';
import { findConstantFromValue, sortByOrder } from 'src/utils';
import {
  StyledCVPDFContentInformations,
  StyledCVPDFTitle,
} from './CVPDF.styles';

interface ContactInformationPDFProps {
  phone: string;
  email?: string;
  departments?: {
    name: DepartmentName;
    order: number;
  }[];
}

export function CVContactInformationPDF({
  phone,
  email,
  departments,
}: ContactInformationPDFProps) {
  const sortedDepartments =
    departments && departments.length > 0 ? sortByOrder(departments) : [];
  return (
    <StyledCVPDFContentInformations>
      <StyledCVPDFTitle>Contact</StyledCVPDFTitle>
      <ul>
        {phone && (
          <li>
            <p className="subtitle">
              <LucidIcon name="Phone" /> <span>Numéro de téléphone</span>
            </p>
            <p className="content">{phone}</p>
          </li>
        )}
        {email && (
          <li>
            <p className="subtitle">
              <LucidIcon name="MessageCircle" /> <span>Email</span>
            </p>
            <p className="content">{email}</p>
          </li>
        )}
        {/* DEPRECATED => : */}
        {sortedDepartments && sortedDepartments.length > 0 && (
          <li>
            <p className="subtitle">
              <LucidIcon name="MapPin" /> <span>Localisation</span>
            </p>
            {sortedDepartments?.length &&
              sortedDepartments
                .map(({ name }) => {
                  return findConstantFromValue(name, DEPARTMENTS_FILTERS).label;
                })
                .join(' / ')}
          </li>
        )}
        {/* <= DEPRECATED */}
      </ul>
    </StyledCVPDFContentInformations>
  );
}
