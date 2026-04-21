import React from 'react';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import {
  StyledCVPDFContentInformations,
  StyledCVPDFTitle,
} from './CVPDF.styles';

interface ContactInformationPDFProps {
  phone: string;
  email?: string;
}

export function CVContactInformationPDF({
  phone,
  email,
}: ContactInformationPDFProps) {
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
      </ul>
    </StyledCVPDFContentInformations>
  );
}
