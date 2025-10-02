import React, { useCallback, useMemo } from 'react';
import { openModal } from '@/src/components/modals/Modal';
import { ProfilePartCard } from '@/src/components/profile/ProfilePartCards/Card/Card/Card';
import { DocumentItem } from '@/src/components/utils/DocumentItem/DocumentItem';
import { useUpdateCompany } from '@/src/hooks/useUpdateCompany';
import {
  IlluCandidatFolder,
  IlluLinkedIn,
  IlluOrdiCV,
} from 'assets/icons/icons';
import { CompanyLinksModalEdit } from '../../../modals/CompanyLinksModalEdit';
import { Text } from 'src/components/utils';
import {
  StyledDocumentList,
  StyledFallbackContentContainer,
} from './CompanyLinks.styles';

export interface CompanyLinksProps {
  url?: string | null;
  hiringUrl?: string | null;
  linkedInUrl?: string | null;
  isEditable?: boolean;
  smallCard?: boolean;
}

export const CompanyLinks = ({
  url,
  hiringUrl,
  linkedInUrl,
  isEditable = false,
  smallCard = false,
}: CompanyLinksProps) => {
  const isCompleted = !!linkedInUrl || !!url || !!hiringUrl;

  const { updateCompany } = useUpdateCompany();

  const openEditCompanyLinks = useCallback(() => {
    openModal(
      <CompanyLinksModalEdit
        dispatchOnSubmit={(fields) => {
          updateCompany(fields);
        }}
        url={url}
        linkedInUrl={linkedInUrl}
        hiringUrl={hiringUrl}
      />
    );
  }, [hiringUrl, linkedInUrl, updateCompany, url]);

  const ctaTitle = useMemo(
    () => (isEditable ? 'Modifier' : null),
    [isEditable]
  );

  return (
    <ProfilePartCard
      title="Liens"
      isCompleted={isCompleted}
      isEditable={isEditable}
      ctaTitle={ctaTitle}
      ctaCallback={openEditCompanyLinks}
      fallback={{
        content: (
          <StyledFallbackContentContainer>
            <Text>
              Ajoutez les liens utiles pour que les candidats découvrent votre
              entreprise (LinkedIn, site, etc.).
            </Text>
          </StyledFallbackContentContainer>
        ),
        icon: <IlluOrdiCV />,
      }}
      smallCard={smallCard}
    >
      <StyledDocumentList>
        {linkedInUrl && (
          <DocumentItem
            name="LinkedIn"
            icon={<IlluLinkedIn width={38} height={38} />}
            onClick={() => {
              window.open(linkedInUrl, '_blank');
            }}
          />
        )}
        {url && (
          <DocumentItem
            name="Site internet"
            icon={<IlluOrdiCV width={38} height={38} />}
            onClick={() => {
              window.open(url, '_blank');
            }}
          />
        )}
        {hiringUrl && (
          <DocumentItem
            name="Site de recrutement"
            icon={<IlluCandidatFolder width={38} height={38} />}
            onClick={() => {
              window.open(hiringUrl, '_blank');
            }}
          />
        )}
      </StyledDocumentList>
    </ProfilePartCard>
  );
};
