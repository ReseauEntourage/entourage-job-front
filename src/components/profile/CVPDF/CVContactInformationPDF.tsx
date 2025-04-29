import React from 'react';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { Department, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { findConstantFromValue, sortByOrder } from 'src/utils';
import {
  StyledCVPDFContentInformations,
  StyledCVPDFTitle,
} from './CVPDF.styles';

interface ContactInformationPDFProps {
  phone: string;
  email?: string;
  address: string;
  locations: {
    name: Department;
    order: number;
  }[];
}

export function CVContactInformationPDF({
  phone,
  email,
  address,
  locations,
}: ContactInformationPDFProps) {
  const sortedLocations =
    locations && locations.length > 0 ? sortByOrder(locations) : [];
  return (
    <StyledCVPDFContentInformations>
      <StyledCVPDFTitle>Contact</StyledCVPDFTitle>
      <ul>
        {phone && (
          <li>
            <div>
              <p className="subtitle">
                <LucidIcon name="Phone" /> <span>Numéro de téléphone</span>
              </p>
              <p className="content">{phone}</p>
            </div>
          </li>
        )}
        {email && (
          <li>
            <div>
              <p className="subtitle">
                <LucidIcon name="MessageCircle" /> <span>Email</span>
              </p>
              <p className="content">{email}</p>
            </div>
          </li>
        )}
        <ul>
          {address && (
            <li>
              <div>
                <p className="subtitle">
                  <LucidIcon name="House" /> <span>Adresse</span>
                </p>
                <p className="content">{address}</p>
              </div>
            </li>
          )}
        </ul>
        {sortedLocations && sortedLocations.length > 0 && (
          <li>
            <div>
              <p className="subtitle">
                <LucidIcon name="MapPin" /> <span>Localisation</span>
              </p>
              <p className="content">
                {locations
                  .map(({ name }) => {
                    return findConstantFromValue(name, DEPARTMENTS_FILTERS)
                      .label;
                  })
                  .join(' / ')}
              </p>
            </div>
          </li>
        )}
      </ul>
    </StyledCVPDFContentInformations>
  );
}
