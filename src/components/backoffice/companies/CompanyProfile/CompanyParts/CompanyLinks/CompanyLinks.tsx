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
  name: string;
  url?: string | null;
  hiringUrl?: string | null;
  linkedInUrl?: string | null;
  isEditable?: boolean;
  smallCard?: boolean;
}

export const CompanyLinks = ({
  name,
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

  const normalizedUrl = (urlString: string) => {
    if (urlString.startsWith('http://') || urlString.startsWith('https://')) {
      return urlString;
    }
    return `http://${urlString}`;
  };

  const fallback = useMemo(() => {
    const content = isEditable ? (
      <StyledFallbackContentContainer>
        <Text>
          Ajoutez les liens utiles pour que les candidats découvrent votre
          entreprise (LinkedIn, site, etc.).
        </Text>
      </StyledFallbackContentContainer>
    ) : (
      <Text>{`${name} n'a pas encore renseigné ses informations`}</Text>
    );
    return {
      content,
      icon: <IlluOrdiCV />,
    };
  }, [isEditable, name]);

  return (
    <ProfilePartCard
      title="Liens"
      isCompleted={isCompleted}
      isEditable={isEditable}
      ctaTitle={ctaTitle}
      ctaCallback={openEditCompanyLinks}
      fallback={fallback}
      smallCard={smallCard}
    >
      <StyledDocumentList>
        {linkedInUrl && (
          <DocumentItem
            name="LinkedIn"
            icon={<IlluLinkedIn width={38} height={38} />}
            onClick={() => {
              window.open(normalizedUrl(linkedInUrl), '_blank');
            }}
          />
        )}
        {url && (
          <DocumentItem
            name="Site internet"
            icon={<IlluOrdiCV width={38} height={38} />}
            onClick={() => {
              window.open(normalizedUrl(url), '_blank');
            }}
          />
        )}
        {hiringUrl && (
          <DocumentItem
            name="Site de recrutement"
            icon={<IlluCandidatFolder width={38} height={38} />}
            onClick={() => {
              window.open(normalizedUrl(hiringUrl), '_blank');
            }}
          />
        )}
      </StyledDocumentList>
    </ProfilePartCard>
  );
};
